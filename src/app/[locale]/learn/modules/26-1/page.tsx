'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_26_1', phase: 6, topic: 'Indian Contributions', moduleNumber: '26.1',
  title: { en: 'Earth Rotates — 1000 Years Before Europe', hi: 'पृथ्वी घूमती है — यूरोप से 1000 वर्ष पहले' },
  subtitle: {
    en: 'Aryabhata\'s 499 CE declaration that Earth rotates on its axis — a millennium before Copernicus shocked Europe with the same idea',
    hi: '499 ईस्वी में आर्यभट की घोषणा कि पृथ्वी अपनी धुरी पर घूमती है — कोपर्निकस से एक सहस्राब्दी पहले',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 26-2: Gravity Before Newton', hi: 'मॉड्यूल 26-2: न्यूटन से पहले गुरुत्वाकर्षण' }, href: '/learn/modules/26-2' },
    { label: { en: 'Module 26-3: Speed of Light', hi: 'मॉड्यूल 26-3: प्रकाश की गति' }, href: '/learn/modules/26-3' },
    { label: { en: 'Module 25-1: Zero & Place Value', hi: 'मॉड्यूल 25-1: शून्य और स्थानमान' }, href: '/learn/modules/25-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q26_1_01', type: 'mcq',
    question: {
      en: 'Who stated that the Earth rotates on its own axis, approximately 1,000 years before Copernicus?',
      hi: 'किसने कोपर्निकस से लगभग 1,000 वर्ष पहले कहा कि पृथ्वी अपनी धुरी पर घूमती है?',
    },
    options: [
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
      { en: 'Bhaskaracharya', hi: 'भास्कराचार्य' },
      { en: 'Aryabhata', hi: 'आर्यभट' },
      { en: 'Varahamihira', hi: 'वराहमिहिर' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Aryabhata (476–550 CE), one of India\'s greatest mathematicians and astronomers, explicitly stated that the Earth rotates on its own axis in his Aryabhatiya (499 CE). He wrote that the apparent daily rotation of stars is caused not by the stars moving, but by Earth spinning. This was a profound insight that placed him 1,044 years ahead of Copernicus\'s heliocentric model (1543 CE) and 1,124 years ahead of the telescope\'s invention (1609 CE).',
      hi: 'आर्यभट (476-550 ईस्वी), भारत के महानतम गणितज्ञों और खगोलशास्त्रियों में से एक, ने अपनी आर्यभटीय (499 ईस्वी) में स्पष्ट रूप से कहा कि पृथ्वी अपनी धुरी पर घूमती है। उन्होंने लिखा कि तारों का प्रत्यक्ष दैनिक घूर्णन तारों के चलने से नहीं, बल्कि पृथ्वी के घूमने से होता है। यह एक गहन अंतर्दृष्टि थी जिसने उन्हें कोपर्निकस के सूर्यकेन्द्रीय मॉडल (1543 ईस्वी) से 1,044 वर्ष और दूरदर्शी के आविष्कार (1609 ईस्वी) से 1,124 वर्ष आगे रखा।',
    },
  },
  {
    id: 'q26_1_02', type: 'mcq',
    question: {
      en: 'In what year did Aryabhata write the Aryabhatiya?',
      hi: 'आर्यभट ने आर्यभटीय कब लिखी?',
    },
    options: [
      { en: '476 CE', hi: '476 ईस्वी' },
      { en: '499 CE', hi: '499 ईस्वी' },
      { en: '550 CE', hi: '550 ईस्वी' },
      { en: '628 CE', hi: '628 ईस्वी' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Aryabhata wrote the Aryabhatiya in 499 CE, when he was 23 years old. He tells us this explicitly in the text itself, stating that 3,600 years of the Kali Yuga had elapsed, placing the composition in 499 CE. The text covers arithmetic, algebra, plane trigonometry, spherical trigonometry, continued fractions, quadratic equations, and astronomical calculations — all in 121 compact verses. It remains one of the most extraordinary scientific documents of antiquity.',
      hi: 'आर्यभट ने 499 ईस्वी में आर्यभटीय लिखी, जब वे 23 वर्ष के थे। उन्होंने यह स्वयं ग्रन्थ में स्पष्ट रूप से बताया है, कहते हुए कि कलियुग के 3,600 वर्ष बीत चुके थे, जो रचना को 499 ईस्वी में स्थापित करता है। ग्रन्थ में अंकगणित, बीजगणित, समतल त्रिकोणमिति, गोलाकार त्रिकोणमिति, सतत भिन्न, द्विघात समीकरण, और खगोलीय गणनाएँ — सभी 121 संक्षिप्त श्लोकों में — शामिल हैं। यह प्राचीनता के सबसे असाधारण वैज्ञानिक दस्तावेजों में से एक है।',
    },
  },
  {
    id: 'q26_1_03', type: 'mcq',
    question: {
      en: 'In which section of the Aryabhatiya did Aryabhata state that the Earth rotates?',
      hi: 'आर्यभटीय के किस खंड में आर्यभट ने कहा कि पृथ्वी घूमती है?',
    },
    options: [
      { en: 'Ganitapada (mathematics)', hi: 'गणितपाद (गणित)' },
      { en: 'Kalakriyapada (time reckoning)', hi: 'कालक्रियापाद (कालगणना)' },
      { en: 'Golapada (celestial sphere)', hi: 'गोलपाद (खगोलीय गोला)' },
      { en: 'Dasagitika (numerical data)', hi: 'दशगीतिका (संख्यात्मक डेटा)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Aryabhata stated Earth\'s rotation in the Golapada (the chapter on the celestial sphere — "gola" means sphere). In verse Golapada 9–10, he writes: "Just as a man in a moving boat sees stationary objects moving backward, so too the fixed stars appear to move westward at Lanka — it is the Earth that moves." This analogy is remarkably modern in its relativistic framing: apparent motion depends on the frame of reference. The Golapada covers spherical astronomy, eclipses, and the model of the cosmos.',
      hi: 'आर्यभट ने गोलपाद (खगोलीय गोले पर अध्याय — "गोल" का अर्थ है गोला) में पृथ्वी के घूर्णन का कथन किया। गोलपाद 9-10 श्लोक में वे लिखते हैं: "जैसे एक चलती नाव में आदमी स्थिर वस्तुओं को पीछे जाते देखता है, उसी तरह लंका में स्थिर तारे पश्चिम की ओर जाते प्रतीत होते हैं — यह पृथ्वी है जो चलती है।" यह उपमा अपने सापेक्षतावादी ढाँचे में उल्लेखनीय रूप से आधुनिक है: प्रत्यक्ष गति संदर्भ के फ्रेम पर निर्भर करती है।',
    },
  },
  {
    id: 'q26_1_04', type: 'mcq',
    question: {
      en: 'Who among major Indian astronomers contradicted Aryabhata\'s view that the Earth rotates?',
      hi: 'प्रमुख भारतीय खगोलशास्त्रियों में से किसने पृथ्वी के घूमने के आर्यभट के विचार का खंडन किया?',
    },
    options: [
      { en: 'Varahamihira', hi: 'वराहमिहिर' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
      { en: 'Bhaskaracharya', hi: 'भास्कराचार्य' },
      { en: 'Lalla', hi: 'लल्ल' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Brahmagupta (598–668 CE), in his Brahmasphutasiddhanta (628 CE), strongly criticized Aryabhata\'s claim that the Earth rotates. Brahmagupta argued that if the Earth spun, birds and clouds would be left behind, and objects thrown upward would land far from where they were thrown. This is actually a sophisticated objection — the answer requires the concept of inertia (Galileo\'s principle), which was not yet formalized. Ironically, this disagreement between two great Indian mathematicians shows the active, self-critical nature of ancient Indian science.',
      hi: 'ब्रह्मगुप्त (598-668 ईस्वी) ने अपने ब्रह्मस्फुटसिद्धान्त (628 ईस्वी) में पृथ्वी के घूमने के आर्यभट के दावे की कड़ी आलोचना की। ब्रह्मगुप्त ने तर्क दिया कि यदि पृथ्वी घूमती, तो पक्षी और बादल पीछे रह जाते, और ऊपर फेंकी गई वस्तुएँ उससे बहुत दूर उतरतीं जहाँ से फेंकी गई थीं। यह वास्तव में एक परिष्कृत आपत्ति है — उत्तर के लिए जड़ता की अवधारणा (गैलीलियो के सिद्धान्त) की आवश्यकता है, जो अभी औपचारिक नहीं थी। व्यंग्यात्मक रूप से, दो महान भारतीय गणितज्ञों के बीच यह असहमति प्राचीन भारतीय विज्ञान की सक्रिय, आत्म-आलोचनात्मक प्रकृति को दर्शाती है।',
    },
  },
  {
    id: 'q26_1_05', type: 'mcq',
    question: {
      en: 'How accurate was Aryabhata\'s calculation of Earth\'s circumference?',
      hi: 'पृथ्वी की परिधि की आर्यभट की गणना कितनी सटीक थी?',
    },
    options: [
      { en: 'About 85% accurate', hi: 'लगभग 85% सटीक' },
      { en: 'About 92% accurate', hi: 'लगभग 92% सटीक' },
      { en: 'About 99.7% accurate', hi: 'लगभग 99.7% सटीक' },
      { en: 'About 75% accurate', hi: 'लगभग 75% सटीक' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Aryabhata calculated Earth\'s circumference as 4,967 yojanas (where 1 yojana ≈ 8 km), giving approximately 39,736 km. The actual circumference of Earth at the equator is 40,075 km. This means Aryabhata\'s value was accurate to 99.7% — a remarkable achievement for 499 CE. By comparison, the famous Greek Eratosthenes (276–195 BCE) calculated Earth\'s circumference with about 99.4% accuracy. Both demonstrate that precise geodetic measurement was achieved in the ancient world through careful astronomical observation.',
      hi: 'आर्यभट ने पृथ्वी की परिधि 4,967 योजन (जहाँ 1 योजन ≈ 8 किमी) गणना की, जो लगभग 39,736 किमी है। भूमध्य रेखा पर पृथ्वी की वास्तविक परिधि 40,075 किमी है। इसका मतलब है कि आर्यभट का मान 99.7% सटीक था — 499 ईस्वी के लिए एक उल्लेखनीय उपलब्धि। तुलना के लिए, प्रसिद्ध ग्रीक एराटोस्थनीज (276-195 ईसा पूर्व) ने पृथ्वी की परिधि की गणना लगभग 99.4% सटीकता से की। दोनों दर्शाते हैं कि सावधानीपूर्वक खगोलीय अवलोकन के माध्यम से प्राचीन दुनिया में सटीक भूगणित माप प्राप्त किया गया था।',
    },
  },
  {
    id: 'q26_1_06', type: 'mcq',
    question: {
      en: 'What was the dominant European model of the cosmos that Aryabhata\'s insight contradicted?',
      hi: 'ब्रह्मांड का कौन सा यूरोपीय मॉडल था जिसका आर्यभट की अंतर्दृष्टि ने खंडन किया?',
    },
    options: [
      { en: 'The Copernican heliocentric model', hi: 'कोपर्निकन सूर्यकेन्द्रीय मॉडल' },
      { en: 'The Ptolemaic geocentric model', hi: 'टॉलेमिक भूकेन्द्रीय मॉडल' },
      { en: 'The Newtonian gravitational model', hi: 'न्यूटोनियन गुरुत्वाकर्षण मॉडल' },
      { en: 'The Einsteinian relativistic model', hi: 'आइंस्टीनियन सापेक्षतावादी मॉडल' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Ptolemaic geocentric model — developed by Claudius Ptolemy in Alexandria around 150 CE — placed Earth at the centre of the universe, with the Sun, Moon, planets, and stars all revolving around a stationary Earth. This model dominated European astronomy for over 1,300 years, until Copernicus (1543 CE). Aryabhata\'s rotating Earth directly contradicted the Ptolemaic model\'s central assumption. What makes this even more striking is that Aryabhata and Ptolemy were near-contemporaries — Ptolemy\'s model was being codified while Aryabhata was already going beyond it.',
      hi: 'टॉलेमिक भूकेन्द्रीय मॉडल — लगभग 150 ईस्वी में अलेक्जेंड्रिया में क्लॉडियस टॉलेमी द्वारा विकसित — ने पृथ्वी को ब्रह्मांड के केन्द्र में रखा, सूर्य, चन्द्रमा, ग्रहों और तारों के साथ सभी एक स्थिर पृथ्वी के चारों ओर परिक्रमा कर रहे थे। यह मॉडल 1,300 से अधिक वर्षों तक यूरोपीय खगोल विज्ञान पर हावी रहा, कोपर्निकस (1543 ईस्वी) तक। आर्यभट की घूमती हुई पृथ्वी ने सीधे टॉलेमिक मॉडल की केन्द्रीय धारणा का खंडन किया।',
    },
  },
  {
    id: 'q26_1_07', type: 'mcq',
    question: {
      en: 'Who proposed heliocentrism in Europe, and in what year?',
      hi: 'यूरोप में सूर्यकेन्द्रवाद किसने प्रस्तावित किया, और किस वर्ष में?',
    },
    options: [
      { en: 'Galileo Galilei in 1610', hi: 'गैलीलियो गैलीलेई, 1610 में' },
      { en: 'Johannes Kepler in 1609', hi: 'जोहान्स केपलर, 1609 में' },
      { en: 'Nicolaus Copernicus in 1543', hi: 'निकोलस कोपर्निकस, 1543 में' },
      { en: 'Isaac Newton in 1687', hi: 'आइज़क न्यूटन, 1687 में' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Nicolaus Copernicus published De Revolutionibus Orbium Coelestium in 1543 CE, proposing that the Sun, not Earth, is at the centre of the solar system, and that Earth revolves around the Sun while rotating on its axis. This sparked the "Copernican Revolution" in European science and led to Galileo\'s house arrest by the Inquisition (1633). Aryabhata had described Earth\'s axial rotation in 499 CE — 1,044 years earlier. The concept of Earth moving had been considered heretical in medieval Europe; in India, it was discussed openly in scholarly debate.',
      hi: 'निकोलस कोपर्निकस ने 1543 ईस्वी में डे रिवोल्यूशनिबस ऑर्बियम कोएलेस्टियम प्रकाशित किया, यह प्रस्तावित करते हुए कि सूर्य, पृथ्वी नहीं, सौरमंडल के केन्द्र में है, और पृथ्वी अपनी धुरी पर घूमते हुए सूर्य के चारों ओर परिक्रमा करती है। इसने यूरोपीय विज्ञान में "कोपर्निकन क्रांति" को जन्म दिया और गैलीलियो की जिज्ञासा द्वारा गृह नज़रबंदी (1633) का कारण बना। आर्यभट ने 499 ईस्वी में — 1,044 वर्ष पहले — पृथ्वी के अक्षीय घूर्णन का वर्णन किया था।',
    },
  },
  {
    id: 'q26_1_08', type: 'mcq',
    question: {
      en: 'Aryabhata also computed the length of a sidereal day with remarkable precision. Which value did he give?',
      hi: 'आर्यभट ने भी उल्लेखनीय सटीकता के साथ नाक्षत्र दिन की लम्बाई गणना की। उन्होंने कौन सा मान दिया?',
    },
    options: [
      { en: '23 hours, 56 minutes, 4.1 seconds', hi: '23 घण्टे, 56 मिनट, 4.1 सेकंड' },
      { en: '24 hours exactly', hi: 'ठीक 24 घण्टे' },
      { en: '23 hours, 50 minutes, 12 seconds', hi: '23 घण्टे, 50 मिनट, 12 सेकंड' },
      { en: '24 hours, 3 minutes, 56 seconds', hi: '24 घण्टे, 3 मिनट, 56 सेकंड' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Aryabhata calculated the sidereal day (the time for Earth to complete one rotation relative to distant stars) as 23 hours, 56 minutes, and 4.1 seconds. The modern value is 23 hours, 56 minutes, and 4.0916 seconds. This is accurate to within a fraction of a second — an astonishing precision achieved purely through naked-eye astronomical observation and mathematical calculation. The slight difference between a sidereal day (23h 56m 4s) and a solar day (24h) is because Earth also moves along its orbit, requiring an extra ~4 minutes to bring the Sun back to the same apparent position.',
      hi: 'आर्यभट ने नाक्षत्र दिन (पृथ्वी द्वारा दूर के तारों के सापेक्ष एक घूर्णन पूरा करने का समय) 23 घण्टे, 56 मिनट, 4.1 सेकंड गणना किया। आधुनिक मान 23 घण्टे, 56 मिनट, 4.0916 सेकंड है। यह एक सेकंड के अंश के भीतर सटीक है — नग्न आँखों के खगोलीय अवलोकन और गणितीय गणना के माध्यम से प्राप्त एक आश्चर्यजनक सटीकता।',
    },
  },
  {
    id: 'q26_1_09', type: 'true_false',
    question: {
      en: 'Aryabhata stated that the sky rotates around a stationary Earth, which is why stars appear to move.',
      hi: 'आर्यभट ने कहा कि आकाश एक स्थिर पृथ्वी के चारों ओर घूमता है, इसीलिए तारे गतिशील प्रतीत होते हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Aryabhata explicitly stated the opposite: it is the Earth that rotates, not the sky. In Golapada 9, he uses the analogy of a person on a moving boat who sees stationary objects appearing to move in the opposite direction. He wrote: "The stars are stationary. The apparent westward movement of stars is due to the eastward rotation of the Earth at Lanka." This is the correct modern understanding. The apparent daily motion of stars is indeed caused by Earth\'s rotation, not by the stars themselves moving.',
      hi: 'असत्य। आर्यभट ने स्पष्ट रूप से विपरीत कहा: यह पृथ्वी है जो घूमती है, न कि आकाश। गोलपाद 9 में, वे एक चलती नाव में व्यक्ति की उपमा का उपयोग करते हैं जो स्थिर वस्तुओं को विपरीत दिशा में जाते देखता है। उन्होंने लिखा: "तारे स्थिर हैं। तारों की प्रत्यक्ष पश्चिमी गति लंका पर पृथ्वी के पूर्वी घूर्णन के कारण है।" यह सही आधुनिक समझ है।',
    },
  },
  {
    id: 'q26_1_10', type: 'true_false',
    question: {
      en: 'Brahmagupta agreed with Aryabhata that the Earth rotates, continuing the Indian tradition of a rotating Earth.',
      hi: 'ब्रह्मगुप्त ने आर्यभट से सहमति जताई कि पृथ्वी घूमती है, घूमती पृथ्वी की भारतीय परम्परा को जारी रखते हुए।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Brahmagupta (628 CE) actually disagreed with Aryabhata and rejected Earth\'s rotation. He argued that a rotating Earth would cause wind, birds, and clouds to be left behind. This disagreement is historically significant: it shows that ancient Indian astronomy was not monolithic but engaged in real scientific debate, with scholars challenging each other\'s ideas with reasoned arguments. The very existence of this debate — and the fact that both sides are preserved — demonstrates the intellectual vitality of the tradition. Brahmagupta was wrong on this specific point, but his challenge forced later astronomers to think more carefully about the question.',
      hi: 'असत्य। ब्रह्मगुप्त (628 ईस्वी) ने वास्तव में आर्यभट से असहमति जताई और पृथ्वी के घूर्णन को अस्वीकार किया। उन्होंने तर्क दिया कि एक घूमती पृथ्वी हवा, पक्षियों और बादलों को पीछे छोड़ देगी। यह असहमति ऐतिहासिक रूप से महत्त्वपूर्ण है: यह दर्शाती है कि प्राचीन भारतीय खगोल विज्ञान अखंड नहीं था बल्कि वास्तविक वैज्ञानिक बहस में लगा हुआ था। ब्रह्मगुप्त इस विशिष्ट बिन्दु पर गलत थे, लेकिन उनकी चुनौती ने बाद के खगोलशास्त्रियों को इस प्रश्न के बारे में अधिक सावधानी से सोचने पर मजबूर किया।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Aryabhata's Declaration                                    */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'आर्यभट की घोषणा: पृथ्वी घूमती है' : 'Aryabhata\'s Declaration: Earth Rotates'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>499 ईस्वी में, 23 वर्षीय आर्यभट ने आर्यभटीय लिखी — एक ग्रन्थ जो खगोल विज्ञान और गणित में अपने युग से बहुत आगे था। इसमें एक साहसी दावा था जो यूरोपीय वैज्ञानिकों को एक हज़ार वर्षों बाद झकझोरेगा: आकाश नहीं घूमता — पृथ्वी घूमती है।</>
            : <>In 499 CE, a 23-year-old named Aryabhata wrote the Aryabhatiya — a treatise that was far ahead of its time in astronomy and mathematics. It contained a bold claim that would not shake European scientists until a thousand years later: the sky does not rotate — the Earth rotates.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'नाव की उपमा — गोलपाद 9' : 'The Boat Analogy — Golapada 9'}
        </h4>
        <blockquote className="border-l-2 border-gold-primary/40 pl-4 mb-3">
          <p className="text-gold-light text-xs italic leading-relaxed">
            {isHi
              ? '"जैसे एक चलती नाव में आदमी स्थिर वस्तुओं को पीछे जाते देखता है, उसी तरह लंका में स्थिर तारे पश्चिम की ओर जाते प्रतीत होते हैं। यह पृथ्वी है जो गोलाकार है और पूर्व की ओर घूमती है।"'
              : '"Just as a man in a moving boat sees stationary objects going backward, so too the stationary stars are seen going west at Lanka — it is the Earth that is round and turns eastward."'}
          </p>
          <p className="text-text-secondary text-xs mt-1">— {isHi ? 'आर्यभट, आर्यभटीय, गोलपाद 9 (499 ईस्वी)' : 'Aryabhata, Aryabhatiya, Golapada 9 (499 CE)'}</p>
        </blockquote>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>यह उपमा उल्लेखनीय रूप से आधुनिक है। आर्यभट ने सापेक्षतावादी सोच का उपयोग किया — प्रत्यक्ष गति इस बात पर निर्भर करती है कि आप किस संदर्भ के फ्रेम से देख रहे हैं। यह गैलीलियो के सापेक्षता के सिद्धान्त से 1,100 वर्ष पहले था।</>
            : <>This analogy is remarkably modern. Aryabhata used relativistic thinking — apparent motion depends on your frame of reference. This was 1,100 years before Galileo's principle of relativity.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सटीकता की तुलना' : 'Accuracy Comparison'}
        </h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <div className="flex justify-between">
            <span>{isHi ? 'आर्यभट — नाक्षत्र दिन:' : 'Aryabhata — Sidereal day:'}</span>
            <span className="text-gold-light font-mono">23h 56m 4.1s</span>
          </div>
          <div className="flex justify-between">
            <span>{isHi ? 'आधुनिक मान:' : 'Modern value:'}</span>
            <span className="text-emerald-400 font-mono">23h 56m 4.09s</span>
          </div>
          <div className="flex justify-between">
            <span>{isHi ? 'त्रुटि:' : 'Error:'}</span>
            <span className="text-gold-primary font-mono">&lt;0.01s</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gold-primary/10 flex justify-between">
            <span>{isHi ? 'पृथ्वी की परिधि:' : 'Earth\'s circumference:'}</span>
            <span className="text-gold-light font-mono">99.7% {isHi ? 'सटीक' : 'accurate'}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Debate and European Context                            */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'वैज्ञानिक बहस और यूरोपीय संदर्भ' : 'Scientific Debate and European Context'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आर्यभट का सिद्धान्त सर्वसम्मति से स्वीकृत नहीं था — इसे चुनौती दी गई, बहस की गई, और परिष्कृत किया गया। यह वास्तविक विज्ञान की विशेषता है। जबकि भारतीय विद्वान पृथ्वी के घूर्णन पर बहस कर रहे थे, यूरोप में टॉलेमी के भूकेन्द्रीय मॉडल को एक धार्मिक सत्य के रूप में माना जाता था।</>
            : <>Aryabhata's theory was not unanimously accepted — it was challenged, debated, and refined. This is the hallmark of real science. While Indian scholars debated Earth's rotation, in Europe Ptolemy's geocentric model was treated as religious truth.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'समानान्तर इतिहास' : 'Parallel Histories'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">499 ईस्वी / 499 CE:</span> {isHi ? 'आर्यभट — पृथ्वी पूर्व की ओर घूमती है' : 'Aryabhata — Earth rotates eastward'}</p>
          <p><span className="text-gold-light font-medium">628 ईस्वी / 628 CE:</span> {isHi ? 'ब्रह्मगुप्त — पृथ्वी के घूर्णन का खंडन करते हैं' : 'Brahmagupta — disputes Earth\'s rotation'}</p>
          <p><span className="text-gold-light font-medium">~800 ईस्वी / ~800 CE:</span> {isHi ? 'भास्कर प्रथम — आर्यभट के मत का समर्थन करते हैं' : 'Bhaskara I — supports Aryabhata\'s position'}</p>
          <p><span className="text-gold-light font-medium">1150 ईस्वी / 1150 CE:</span> {isHi ? 'भास्कराचार्य द्वितीय — सिद्धान्त शिरोमणि में चर्चा जारी' : 'Bhaskaracharya II — continues discussion in Siddhanta Shiromani'}</p>
          <p><span className="text-gold-light font-medium">1543 ईस्वी / 1543 CE:</span> {isHi ? 'कोपर्निकस — यूरोप में हेलियोसेन्ट्रिज्म प्रस्तावित करते हैं' : 'Copernicus — proposes heliocentrism in Europe'}</p>
          <p><span className="text-gold-light font-medium">1610 ईस्वी / 1610 CE:</span> {isHi ? 'गैलीलियो — दूरदर्शी से पुष्टि करते हैं' : 'Galileo — confirms with telescope'}</p>
          <p><span className="text-gold-light font-medium">1633 ईस्वी / 1633 CE:</span> {isHi ? 'गैलीलियो — जिज्ञासा द्वारा घर नज़रबंदी में' : 'Galileo — house arrest by Inquisition'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ब्रह्मगुप्त की आपत्ति क्यों मायने रखती है' : 'Why Brahmagupta\'s Objection Matters'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>ब्रह्मगुप्त की आपत्ति — कि घूमती पृथ्वी पक्षियों और बादलों को पीछे छोड़ देगी — वास्तव में एक वैध वैज्ञानिक चुनौती थी। इसका उत्तर देने के लिए जड़ता की अवधारणा की आवश्यकता थी: पृथ्वी की सतह पर सब कुछ — हवा, बादल, पक्षी — पृथ्वी के साथ घूमती है क्योंकि वे उसी घूर्णी संदर्भ फ्रेम में हैं। यह गैलीलियो (1638) और न्यूटन (1687) तक पूरी तरह स्पष्ट नहीं था। असहमति ने बुद्धिजीवी विमर्श को जीवित रखा।</>
            : <>Brahmagupta's objection — that a rotating Earth would leave birds and clouds behind — was actually a valid scientific challenge. Answering it required the concept of inertia: everything on Earth's surface — air, clouds, birds — rotates with the Earth because they share the same rotating reference frame. This wasn't fully clear until Galileo (1638) and Newton (1687). The disagreement kept intellectual discourse alive.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Legacy and Impact                                          */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'विरासत: भारत से विश्व तक' : 'Legacy: From India to the World'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आर्यभट का प्रभाव उनकी सीमाओं से बहुत आगे फैला। उनके ग्रन्थ का अरबी में अनुवाद 8वीं शताब्दी में हुआ, जिससे उनके विचार इस्लामी स्वर्ण युग के खगोल विज्ञान में प्रवेश कर गए — और वहाँ से मध्ययुगीन यूरोप में।</>
            : <>Aryabhata's influence spread far beyond his borders. His text was translated into Arabic in the 8th century, carrying his ideas into Islamic Golden Age astronomy — and from there into medieval Europe.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आर्यभट की उपलब्धियाँ' : 'Aryabhata\'s Achievements'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {isHi ? 'पृथ्वी का अक्षीय घूर्णन (499 ईस्वी)' : 'Earth\'s axial rotation (499 CE)'}</p>
          <p>→ {isHi ? 'नाक्षत्र दिन: 23h 56m 4.1s (99.9998% सटीक)' : 'Sidereal day: 23h 56m 4.1s (99.9998% accurate)'}</p>
          <p>→ {isHi ? 'पृथ्वी की परिधि: 39,736 किमी (99.7% सटीक)' : 'Earth\'s circumference: 39,736 km (99.7% accurate)'}</p>
          <p>→ {isHi ? 'π ≈ 3.1416 (4 दशमलव स्थानों तक सटीक)' : 'π ≈ 3.1416 (accurate to 4 decimal places)'}</p>
          <p>→ {isHi ? 'ग्रहण: चन्द्रमा की छाया से होते हैं (राक्षस से नहीं)' : 'Eclipses caused by shadows (not demons)'}</p>
          <p>→ {isHi ? 'त्रिकोणमिति: ज्या (sine) फलन की परिभाषा' : 'Trigonometry: defined the sine function (jya)'}</p>
          <p>→ {isHi ? 'खगोलशास्त्र: ग्रहों की परिक्रमा अवधि का सटीक निर्धारण' : 'Astronomy: accurate orbital periods of planets'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सम्मान' : 'Honours'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारत के पहले उपग्रह का नाम आर्यभट रखा गया (1975)। एक चन्द्रमा पर क्रेटर का नाम आर्यभट है। ISRO का पहला प्रायोगिक उपग्रह श्रृंखला "आर्यभट श्रृंखला" थी। आर्यभटीय आज भी गणित और खगोल विज्ञान के पाठ्यक्रम में पढ़ी जाती है। उनका यह कथन — कि पृथ्वी घूमती है और आकाश नहीं — आज की शिक्षा प्रणाली में एक बुनियादी तथ्य के रूप में पढ़ाया जाता है।</>
            : <>India's first satellite was named Aryabhata (1975). A crater on the Moon is named Aryabhata. ISRO's first experimental satellite series was the "Aryabhata Series." The Aryabhatiya is still studied in mathematics and astronomy curricula today. His statement — that Earth rotates and the sky does not — is taught as a foundational fact in modern education.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module26_1Page() {
  return (
    <ModuleContainer
      meta={META}
      questions={QUESTIONS}
      pages={[Page1(), Page2(), Page3()]}
    />
  );
}

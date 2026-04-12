'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_26_2', phase: 6, topic: 'Indian Contributions', moduleNumber: '26.2',
  title: { en: 'Gravity — 500 Years Before Newton', hi: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले' },
  subtitle: {
    en: 'Bhaskaracharya\'s 1150 CE description of Earth\'s gravitational force, and earlier precedents in Brahmagupta and Varahamihira',
    hi: 'भास्कराचार्य का 1150 ईस्वी में पृथ्वी के गुरुत्वाकर्षण बल का वर्णन, और ब्रह्मगुप्त तथा वराहमिहिर में पहले के पूर्वाभास',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 26-1: Earth Rotates', hi: 'मॉड्यूल 26-1: पृथ्वी घूमती है' }, href: '/learn/modules/26-1' },
    { label: { en: 'Module 26-3: Speed of Light', hi: 'मॉड्यूल 26-3: प्रकाश की गति' }, href: '/learn/modules/26-3' },
    { label: { en: 'Module 26-4: Cosmic Time', hi: 'मॉड्यूल 26-4: ब्रह्मांडीय समय' }, href: '/learn/modules/26-4' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q26_2_01', type: 'mcq',
    question: {
      en: 'Who wrote about the Earth\'s attractive force drawing objects toward its centre?',
      hi: 'पृथ्वी के आकर्षण बल के बारे में किसने लिखा जो वस्तुओं को अपने केन्द्र की ओर खींचता है?',
    },
    options: [
      { en: 'Aryabhata', hi: 'आर्यभट' },
      { en: 'Varahamihira', hi: 'वराहमिहिर' },
      { en: 'Bhaskaracharya II (Bhaskara)', hi: 'भास्कराचार्य द्वितीय (भास्कर)' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Bhaskaracharya II (1114–1185 CE), also called Bhaskara or Bhaskara the Learned, wrote about Earth\'s gravitational force in his Siddhanta Shiromani (1150 CE). In the Goladhyaya (celestial sphere) section, he stated: "The Earth has the quality of attraction. All heavy objects fall to the Earth. Therefore the Earth is the refuge (support) of all objects." He understood gravity as an intrinsic property of the Earth — a force of attraction drawing things toward the Earth\'s centre.',
      hi: 'भास्कराचार्य द्वितीय (1114-1185 ईस्वी), जिन्हें भास्कर या भास्कर विद्वान भी कहा जाता है, ने अपनी सिद्धान्त शिरोमणि (1150 ईस्वी) में पृथ्वी के गुरुत्वाकर्षण बल के बारे में लिखा। गोलाध्याय (खगोलीय गोला) खंड में, उन्होंने कहा: "पृथ्वी में आकर्षण का गुण है। सभी भारी वस्तुएँ पृथ्वी पर गिरती हैं। इसलिए पृथ्वी सभी वस्तुओं का आश्रय (आधार) है।" उन्होंने गुरुत्वाकर्षण को पृथ्वी की एक अंतर्निहित संपत्ति के रूप में समझा — एक आकर्षण बल जो चीज़ों को पृथ्वी के केन्द्र की ओर खींचता है।',
    },
  },
  {
    id: 'q26_2_02', type: 'mcq',
    question: {
      en: 'In which text did Bhaskaracharya describe the Earth\'s gravitational attraction?',
      hi: 'किस ग्रन्थ में भास्कराचार्य ने पृथ्वी के गुरुत्वाकर्षण आकर्षण का वर्णन किया?',
    },
    options: [
      { en: 'Aryabhatiya', hi: 'आर्यभटीय' },
      { en: 'Brahmasphutasiddhanta', hi: 'ब्रह्मस्फुटसिद्धान्त' },
      { en: 'Siddhanta Shiromani', hi: 'सिद्धान्त शिरोमणि' },
      { en: 'Pancha Siddhantika', hi: 'पञ्च सिद्धान्तिका' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Bhaskaracharya described gravity in the Siddhanta Shiromani (1150 CE), which translates as "Crown Jewel of Treatises." This comprehensive text on mathematics and astronomy consists of four parts: Lilavati (arithmetic), Bijaganita (algebra), Ganitadhyaya (mathematical astronomy), and Goladhyaya (celestial sphere). The gravitational discussion appears in the Goladhyaya. The Siddhanta Shiromani remained an authoritative text in Indian astronomy for centuries, and Bhaskaracharya is also renowned for anticipating aspects of differential calculus.',
      hi: 'भास्कराचार्य ने सिद्धान्त शिरोमणि (1150 ईस्वी) में गुरुत्वाकर्षण का वर्णन किया, जिसका अनुवाद "ग्रन्थों का मुकुट मणि" होता है। गणित और खगोल विज्ञान पर यह व्यापक ग्रन्थ चार भागों से बना है: लीलावती (अंकगणित), बीजगणित (बीजगणित), गणिताध्याय (गणितीय खगोल विज्ञान), और गोलाध्याय (खगोलीय गोला)। गुरुत्वाकर्षण की चर्चा गोलाध्याय में आती है। सिद्धान्त शिरोमणि सदियों तक भारतीय खगोल विज्ञान में एक आधिकारिक ग्रन्थ रही।',
    },
  },
  {
    id: 'q26_2_03', type: 'mcq',
    question: {
      en: 'In what year did Bhaskaracharya write the Siddhanta Shiromani?',
      hi: 'भास्कराचार्य ने सिद्धान्त शिरोमणि कब लिखी?',
    },
    options: [
      { en: '628 CE', hi: '628 ईस्वी' },
      { en: '1114 CE', hi: '1114 ईस्वी' },
      { en: '1150 CE', hi: '1150 ईस्वी' },
      { en: '1185 CE', hi: '1185 ईस्वी' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Bhaskaracharya wrote the Siddhanta Shiromani in 1150 CE. He was born in 1114 CE and wrote the text at age 36. This places his description of gravitational attraction 537 years before Newton\'s Principia Mathematica (1687 CE). Newton is rightly celebrated for providing the mathematical formula F = Gm₁m₂/r² that quantifies gravity and unifies terrestrial and celestial mechanics — but the qualitative concept of Earth\'s attractive force had been described in India half a millennium earlier.',
      hi: 'भास्कराचार्य ने 1150 ईस्वी में सिद्धान्त शिरोमणि लिखी। उनका जन्म 1114 ईस्वी में हुआ था और उन्होंने 36 वर्ष की आयु में यह ग्रन्थ लिखा। यह उनके गुरुत्वाकर्षण आकर्षण के वर्णन को न्यूटन के प्रिन्सिपिया मैथेमेटिका (1687 ईस्वी) से 537 वर्ष पहले रखता है। न्यूटन को सही रूप से F = Gm₁m₂/r² सूत्र प्रदान करने के लिए मनाया जाता है जो गुरुत्वाकर्षण को मात्रात्मक रूप देता है और स्थलीय व खगोलीय यांत्रिकी को एकीकृत करता है — लेकिन पृथ्वी के आकर्षण बल की गुणात्मक अवधारणा भारत में आधी सहस्राब्दी पहले वर्णित की जा चुकी थी।',
    },
  },
  {
    id: 'q26_2_04', type: 'mcq',
    question: {
      en: 'In which section of the Siddhanta Shiromani does the gravitational discussion appear?',
      hi: 'सिद्धान्त शिरोमणि के किस खंड में गुरुत्वाकर्षण की चर्चा आती है?',
    },
    options: [
      { en: 'Lilavati (arithmetic)', hi: 'लीलावती (अंकगणित)' },
      { en: 'Bijaganita (algebra)', hi: 'बीजगणित (बीजगणित)' },
      { en: 'Ganitadhyaya (mathematical astronomy)', hi: 'गणिताध्याय (गणितीय खगोल विज्ञान)' },
      { en: 'Goladhyaya (celestial sphere)', hi: 'गोलाध्याय (खगोलीय गोला)' },
    ],
    correctAnswer: 3,
    explanation: {
      en: 'The gravitational discussion appears in the Goladhyaya (the chapter on the celestial sphere). "Gola" means sphere, and this section deals with the three-dimensional aspects of astronomy — the geometry of the celestial sphere, the shape of Earth, planetary motions, and physical properties of the Earth. It is in this section that Bhaskaracharya addresses why things fall downward, stating that the Earth attracts all things. The Goladhyaya also contains remarkable insights about the velocity of falling objects.',
      hi: 'गुरुत्वाकर्षण की चर्चा गोलाध्याय (खगोलीय गोले पर अध्याय) में आती है। "गोल" का अर्थ है गोला, और यह खंड खगोल विज्ञान के त्रि-आयामी पहलुओं से संबंधित है — खगोलीय गोले की ज्यामिति, पृथ्वी का आकार, ग्रहों की गतियाँ, और पृथ्वी के भौतिक गुण। इसी खंड में भास्कराचार्य यह संबोधित करते हैं कि चीज़ें नीचे क्यों गिरती हैं, यह कहते हुए कि पृथ्वी सभी चीज़ों को आकर्षित करती है।',
    },
  },
  {
    id: 'q26_2_05', type: 'mcq',
    question: {
      en: 'Who also mentioned Earth\'s gravitational attraction earlier, in 628 CE?',
      hi: 'किसने 628 ईस्वी में पहले पृथ्वी के गुरुत्वाकर्षण आकर्षण का उल्लेख किया?',
    },
    options: [
      { en: 'Aryabhata in Aryabhatiya', hi: 'आर्यभटीय में आर्यभट' },
      { en: 'Brahmagupta in Brahmasphutasiddhanta', hi: 'ब्रह्मस्फुटसिद्धान्त में ब्रह्मगुप्त' },
      { en: 'Varahamihira in Brihat Samhita', hi: 'बृहत् संहिता में वराहमिहिर' },
      { en: 'Pingala in Chandahshastra', hi: 'छन्दःशास्त्र में पिंगल' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Brahmagupta (598–668 CE) mentioned gravitational attraction in his Brahmasphutasiddhanta (628 CE), stating that "the Earth attracts all bodies toward itself" (prthivi sarvani bhutani akarshati). He wrote this 522 years before Bhaskaracharya and 1,059 years before Newton. Brahmagupta\'s statement is briefer and less developed than Bhaskaracharya\'s treatment, but it clearly establishes the concept of Earth as an attracting body. Remarkably, despite this, Brahmagupta rejected Aryabhata\'s rotating Earth — showing that even great scientists can hold contradictory positions.',
      hi: 'ब्रह्मगुप्त (598-668 ईस्वी) ने अपने ब्रह्मस्फुटसिद्धान्त (628 ईस्वी) में गुरुत्वाकर्षण आकर्षण का उल्लेख किया, कहते हुए कि "पृथ्वी सभी पिण्डों को अपनी ओर आकर्षित करती है" (पृथ्वी सर्वाणि भूतानि आकर्षति)। उन्होंने यह भास्कराचार्य से 522 वर्ष पहले और न्यूटन से 1,059 वर्ष पहले लिखा। ब्रह्मगुप्त का कथन भास्कराचार्य के उपचार की तुलना में संक्षिप्त और कम विकसित है, लेकिन यह स्पष्ट रूप से पृथ्वी की एक आकर्षण पिण्ड की अवधारणा स्थापित करता है।',
    },
  },
  {
    id: 'q26_2_06', type: 'mcq',
    question: {
      en: 'What crucial element did Newton add to the concept of gravity that Indian texts lacked?',
      hi: 'गुरुत्वाकर्षण की अवधारणा में न्यूटन ने क्या महत्त्वपूर्ण तत्त्व जोड़ा जो भारतीय ग्रन्थों में नहीं था?',
    },
    options: [
      { en: 'The idea that Earth attracts objects', hi: 'यह विचार कि पृथ्वी वस्तुओं को आकर्षित करती है' },
      { en: 'The observation that objects fall when dropped', hi: 'यह अवलोकन कि छोड़ने पर वस्तुएँ गिरती हैं' },
      { en: 'The mathematical formula F = Gm₁m₂/r² and the unification of celestial and terrestrial gravity', hi: 'गणितीय सूत्र F = Gm₁m₂/r² और खगोलीय और स्थलीय गुरुत्वाकर्षण का एकीकरण' },
      { en: 'The concept that gravity weakens with distance', hi: 'यह अवधारणा कि दूरी के साथ गुरुत्वाकर्षण कमज़ोर होता है' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Newton\'s revolutionary contribution was the precise mathematical formula F = Gm₁m₂/r² (force equals the gravitational constant times the product of two masses, divided by the square of the distance between them) and — crucially — the unification of terrestrial and celestial gravity. Before Newton, people understood that Earth attracts objects, and that planets orbit the Sun. Newton proved these are the SAME force: the gravity that pulls an apple to Earth also keeps the Moon in orbit. This unification, combined with the inverse-square law and universal applicability, was Newton\'s extraordinary achievement.',
      hi: 'न्यूटन का क्रांतिकारी योगदान सटीक गणितीय सूत्र F = Gm₁m₂/r² (बल गुरुत्वाकर्षण स्थिरांक गुणा दो द्रव्यमानों के उत्पाद, बीच की दूरी के वर्ग से विभाजित) और — महत्त्वपूर्ण रूप से — स्थलीय और खगोलीय गुरुत्वाकर्षण का एकीकरण था। न्यूटन से पहले, लोग समझते थे कि पृथ्वी वस्तुओं को आकर्षित करती है, और ग्रह सूर्य के चारों ओर परिक्रमा करते हैं। न्यूटन ने साबित किया कि ये एक ही बल है: वह गुरुत्वाकर्षण जो एक सेब को पृथ्वी पर खींचता है, चन्द्रमा को भी कक्षा में रखता है।',
    },
  },
  {
    id: 'q26_2_07', type: 'mcq',
    question: {
      en: 'In what year did Newton publish his law of universal gravitation?',
      hi: 'न्यूटन ने अपना सार्वत्रिक गुरुत्वाकर्षण नियम किस वर्ष प्रकाशित किया?',
    },
    options: [
      { en: '1665 CE', hi: '1665 ईस्वी' },
      { en: '1676 CE', hi: '1676 ईस्वी' },
      { en: '1687 CE', hi: '1687 ईस्वी' },
      { en: '1705 CE', hi: '1705 ईस्वी' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Isaac Newton published his law of universal gravitation in Philosophiae Naturalis Principia Mathematica in 1687 CE. This is 537 years after Bhaskaracharya\'s Siddhanta Shiromani (1150 CE) and 1,059 years after Brahmagupta\'s Brahmasphutasiddhanta (628 CE). The Principia also presented Newton\'s three laws of motion, the mathematics of orbital mechanics, and the derivation of Kepler\'s laws — making it one of the most important scientific publications in history. Newton famously said he stood "on the shoulders of giants."',
      hi: 'आइज़क न्यूटन ने 1687 ईस्वी में फिलोसोफिए नेचुरालिस प्रिन्सिपिया मैथेमेटिका में अपना सार्वत्रिक गुरुत्वाकर्षण नियम प्रकाशित किया। यह भास्कराचार्य के सिद्धान्त शिरोमणि (1150 ईस्वी) के 537 वर्ष बाद और ब्रह्मगुप्त के ब्रह्मस्फुटसिद्धान्त (628 ईस्वी) के 1,059 वर्ष बाद है। प्रिन्सिपिया में न्यूटन के गति के तीन नियम, कक्षीय यांत्रिकी का गणित, और केपलर के नियमों की व्युत्पत्ति भी प्रस्तुत की गई।',
    },
  },
  {
    id: 'q26_2_08', type: 'mcq',
    question: {
      en: 'How many years gap separates Bhaskaracharya\'s Siddhanta Shiromani (1150 CE) and Newton\'s Principia (1687 CE)?',
      hi: 'भास्कराचार्य के सिद्धान्त शिरोमणि (1150 ईस्वी) और न्यूटन के प्रिन्सिपिया (1687 ईस्वी) के बीच कितने वर्षों का अंतर है?',
    },
    options: [
      { en: '337 years', hi: '337 वर्ष' },
      { en: '437 years', hi: '437 वर्ष' },
      { en: '537 years', hi: '537 वर्ष' },
      { en: '637 years', hi: '637 वर्ष' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '1687 CE minus 1150 CE = 537 years. Bhaskaracharya wrote about Earth\'s gravitational attraction in 1150 CE; Newton\'s precise mathematical law was published in 1687 CE — 537 years later. This gap spans the late medieval period, the Renaissance, the Reformation, the Scientific Revolution, and culminates with Newton. If we count from Brahmagupta (628 CE), the gap is 1,059 years. The concept of Earth\'s gravity as an attractive force was known in India for over half a millennium before it was mathematically formalized in Europe.',
      hi: '1687 ईस्वी - 1150 ईस्वी = 537 वर्ष। भास्कराचार्य ने 1150 ईस्वी में पृथ्वी के गुरुत्वाकर्षण आकर्षण के बारे में लिखा; न्यूटन का सटीक गणितीय नियम 1687 ईस्वी में प्रकाशित हुआ — 537 वर्ष बाद। यह अंतर देर मध्ययुगीन काल, पुनर्जागरण, सुधार, वैज्ञानिक क्रांति को पार करता है और न्यूटन के साथ समाप्त होता है। यदि हम ब्रह्मगुप्त (628 ईस्वी) से गिनें, तो अंतर 1,059 वर्ष है।',
    },
  },
  {
    id: 'q26_2_09', type: 'true_false',
    question: {
      en: 'Indian texts described gravity qualitatively (as an attractive force) but did not provide a quantitative mathematical formula like Newton did.',
      hi: 'भारतीय ग्रन्थों ने गुरुत्वाकर्षण का गुणात्मक रूप से (एक आकर्षण बल के रूप में) वर्णन किया लेकिन न्यूटन जैसा कोई मात्रात्मक गणितीय सूत्र नहीं दिया।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Indian texts clearly describe gravity as an attractive property of the Earth — Brahmagupta (628 CE), Varahamihira (505 CE), and Bhaskaracharya (1150 CE) all state that Earth attracts objects. However, none of them provided a precise mathematical formula specifying how the force depends on mass and distance. Newton\'s F = Gm₁m₂/r² (inverse-square law) was a quantitative breakthrough that made exact predictions possible. The Indian contribution is the qualitative concept; Newton\'s contribution is the quantitative law. Both are significant.',
      hi: 'सत्य। भारतीय ग्रन्थ गुरुत्वाकर्षण को पृथ्वी की एक आकर्षण संपत्ति के रूप में स्पष्ट रूप से वर्णन करते हैं — ब्रह्मगुप्त (628 ईस्वी), वराहमिहिर (505 ईस्वी), और भास्कराचार्य (1150 ईस्वी) सभी कहते हैं कि पृथ्वी वस्तुओं को आकर्षित करती है। हालाँकि, उनमें से किसी ने भी यह निर्दिष्ट करते हुए एक सटीक गणितीय सूत्र प्रदान नहीं किया कि बल द्रव्यमान और दूरी पर कैसे निर्भर करता है। न्यूटन का F = Gm₁m₂/r² (व्युत्क्रम-वर्ग नियम) एक मात्रात्मक सफलता थी जिसने सटीक भविष्यवाणियाँ संभव कीं।',
    },
  },
  {
    id: 'q26_2_10', type: 'true_false',
    question: {
      en: 'Varahamihira (505 CE) also discussed gravitational attraction, providing a third Indian precedent before Bhaskaracharya.',
      hi: 'वराहमिहिर (505 ईस्वी) ने भी गुरुत्वाकर्षण आकर्षण पर चर्चा की, जो भास्कराचार्य से पहले एक तीसरा भारतीय पूर्वाभास प्रदान करता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Varahamihira (505 CE), the great polymath who wrote the Pancha Siddhantika and Brihat Samhita, also discussed what we now call gravitational attraction. He asked: why do objects not fall off the sides or bottom of the spherical Earth? He answered that the Earth\'s inherent attractive force (gurutvaakarshan) holds them. This predates Brahmagupta (628 CE) by over a century, and Bhaskaracharya (1150 CE) by 645 years. The three — Varahamihira, Brahmagupta, Bhaskaracharya — form a continuous 645-year tradition of describing Earth\'s gravity before Newton.',
      hi: 'सत्य। वराहमिहिर (505 ईस्वी), महान बहुज्ञ जिन्होंने पञ्च सिद्धान्तिका और बृहत् संहिता लिखी, ने भी उसकी चर्चा की जिसे हम अब गुरुत्वाकर्षण आकर्षण कहते हैं। उन्होंने पूछा: वस्तुएँ गोलाकार पृथ्वी के किनारों या तल से क्यों नहीं गिरती? उन्होंने उत्तर दिया कि पृथ्वी का अंतर्निहित आकर्षण बल (गुरुत्वाकर्षण) उन्हें थामे रखता है। यह ब्रह्मगुप्त (628 ईस्वी) से एक सदी से अधिक पहले है, और भास्कराचार्य (1150 ईस्वी) से 645 वर्ष पहले। तीनों — वराहमिहिर, ब्रह्मगुप्त, भास्कराचार्य — न्यूटन से पहले पृथ्वी के गुरुत्वाकर्षण का वर्णन करने की एक निरंतर 645-वर्ष परम्परा बनाते हैं।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Concept Before Newton                                  */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'गुरुत्वाकर्षण: भारतीय परम्परा' : 'Gravity: The Indian Tradition'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>न्यूटन के सेब की कहानी प्रसिद्ध है — 1665 में गिरते सेब ने गुरुत्वाकर्षण का नियम प्रेरित किया। लेकिन पृथ्वी को एक ऐसी वस्तु के रूप में देखना जो चीज़ों को अपनी ओर खींचती है, भारत में न्यूटन से 1,000 से अधिक वर्ष पहले से एक स्थापित वैज्ञानिक विचार था।</>
            : <>Newton's apple story is famous — a falling apple in 1665 inspired the law of gravity. But seeing the Earth as an object that pulls things toward itself was an established scientific idea in India more than 1,000 years before Newton.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'तीन भारतीय पूर्वाभास' : 'Three Indian Precedents'}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{isHi ? 'वराहमिहिर (505 ईस्वी)' : 'Varahamihira (505 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'बृहत् संहिता — पृथ्वी के अंतर्निहित आकर्षण बल का वर्णन। पूछते हैं: गोलाकार पृथ्वी के नीचे की वस्तुएँ क्यों नहीं गिरती? उत्तर: पृथ्वी सब कुछ आकर्षित करती है।' : 'Brihat Samhita — describes Earth\'s inherent attractive force. Asks: why do objects below a spherical Earth not fall off? Answer: Earth attracts everything.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{isHi ? 'ब्रह्मगुप्त (628 ईस्वी)' : 'Brahmagupta (628 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'ब्रह्मस्फुटसिद्धान्त — "पृथ्वी सभी पिण्डों को अपनी ओर आकर्षित करती है।" स्पष्ट और संक्षिप्त कथन।' : 'Brahmasphutasiddhanta — "The Earth attracts all bodies toward itself." Clear and concise statement.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{isHi ? 'भास्कराचार्य (1150 ईस्वी)' : 'Bhaskaracharya (1150 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'सिद्धान्त शिरोमणि — सबसे विस्तृत उपचार। "पृथ्वी में आकर्षण का गुण है। सभी भारी वस्तुएँ पृथ्वी पर गिरती हैं।" गोलाध्याय में विस्तृत चर्चा।' : 'Siddhanta Shiromani — most detailed treatment. "The Earth has the quality of attraction. All heavy objects fall to the Earth." Extended discussion in Goladhyaya.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'भास्कराचार्य का मूल श्लोक' : 'Bhaskaracharya\'s Original Verse'}
        </h4>
        <blockquote className="border-l-2 border-gold-primary/40 pl-4">
          <p className="text-gold-light text-xs italic leading-relaxed">
            {isHi
              ? '"पृथ्व्याः समन्तात् आकर्षणशक्तिः। पतन्ति गुरूणि नभसि।  अतः पृथ्वी सर्वाधारा।"'
              : '"The Earth has the power of attraction on all sides. Heavy bodies fall in the sky (toward Earth). Therefore the Earth is the support of all."'}
          </p>
          <p className="text-text-secondary text-xs mt-1">— {isHi ? 'भास्कराचार्य, सिद्धान्त शिरोमणि, गोलाध्याय (1150 ईस्वी)' : 'Bhaskaracharya, Siddhanta Shiromani, Goladhyaya (1150 CE)'}</p>
        </blockquote>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — What Newton Added                                          */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'न्यूटन ने क्या जोड़ा' : 'What Newton Added'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारतीय वैज्ञानिकों की अंतर्दृष्टि को स्वीकार करना न्यूटन की उपलब्धि को कम नहीं करता। न्यूटन ने कुछ ऐसा किया जो भारतीय ग्रन्थों ने नहीं किया: उन्होंने गुरुत्वाकर्षण को एक सटीक, सार्वत्रिक गणितीय नियम में औपचारिक रूप दिया।</>
            : <>Acknowledging Indian insights does not diminish Newton's achievement. Newton did something Indian texts did not: he formalized gravity into a precise, universal mathematical law.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'न्यूटन के तीन योगदान' : 'Newton\'s Three Contributions'}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <div>
            <p className="text-gold-light font-semibold mb-1">{isHi ? '1. सटीक गणितीय सूत्र' : '1. Precise Mathematical Formula'}</p>
            <p className="font-mono text-gold-primary text-sm text-center my-2">F = Gm₁m₂/r²</p>
            <p>{isHi ? 'बल = गुरुत्वाकर्षण स्थिरांक × (द्रव्यमान1 × द्रव्यमान2) / दूरी²। व्युत्क्रम-वर्ग नियम — दूरी दोगुनी होने पर बल चौगुना कम।' : 'Force = gravitational constant × (mass1 × mass2) / distance². Inverse-square law — double the distance, force reduces fourfold.'}</p>
          </div>
          <div>
            <p className="text-gold-light font-semibold mb-1">{isHi ? '2. एकीकरण: स्थलीय + खगोलीय गुरुत्वाकर्षण' : '2. Unification: Terrestrial + Celestial Gravity'}</p>
            <p>{isHi ? 'न्यूटन ने साबित किया कि वह गुरुत्वाकर्षण जो सेब गिराता है और वह जो चन्द्रमा को कक्षा में रखता है — एक ही बल है। यह एकीकरण विज्ञान में क्रांतिकारी था।' : 'Newton proved that the gravity pulling apples and the gravity keeping the Moon in orbit are the SAME force. This unification was revolutionary.'}</p>
          </div>
          <div>
            <p className="text-gold-light font-semibold mb-1">{isHi ? '3. सार्वत्रिकता' : '3. Universality'}</p>
            <p>{isHi ? 'यह नियम सार्वत्रिक है — पृथ्वी, चन्द्रमा, सूर्य, हर पिण्ड हर दूसरे पिण्ड को एक ही सूत्र से आकर्षित करता है।' : 'The law is universal — Earth, Moon, Sun, every body attracts every other by the same formula.'}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'न्यायोचित मूल्यांकन' : 'Fair Assessment'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारतीय योगदान: गुरुत्वाकर्षण को एक वास्तविक भौतिक बल के रूप में पहचानना, इसे पृथ्वी की एक अंतर्निहित संपत्ति के रूप में वर्णित करना, और यह समझाना कि पृथ्वी का गोलाकार रूप क्यों स्थिर है। न्यूटन का योगदान: सटीक गणितीय सूत्र, व्युत्क्रम-वर्ग नियम, स्थलीय और खगोलीय गुरुत्वाकर्षण का एकीकरण, और सार्वत्रिक नियम की खोज। दोनों योगदान वास्तविक और महत्त्वपूर्ण हैं।</>
            : <>Indian contribution: recognizing gravity as a real physical force, describing it as an intrinsic property of the Earth, and explaining why Earth's spherical shape is stable. Newton's contribution: precise mathematical formula, inverse-square law, unification of terrestrial and celestial gravity, and discovery of the universal law. Both contributions are real and significant.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Bhaskaracharya's Broader Genius                           */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'भास्कराचार्य: बहुमुखी प्रतिभा' : 'Bhaskaracharya: Universal Genius'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>गुरुत्वाकर्षण का वर्णन केवल भास्कराचार्य की असाधारण प्रतिभा का एक पहलू है। वे शायद प्राचीन भारत के सबसे बहुमुखी गणितज्ञ थे, जो कई क्षेत्रों में अपने युग से सदियों आगे थे।</>
            : <>The description of gravity is just one aspect of Bhaskaracharya's extraordinary genius. He was perhaps ancient India's most versatile mathematician, centuries ahead of his time in multiple fields.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'भास्कराचार्य की उल्लेखनीय उपलब्धियाँ' : 'Bhaskaracharya\'s Notable Achievements'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {isHi ? 'गुरुत्वाकर्षण: पृथ्वी के आकर्षण बल का वर्णन (1150 ईस्वी)' : 'Gravity: described Earth\'s attractive force (1150 CE)'}</p>
          <p>→ {isHi ? 'अवकलन गणित: गतिशील वस्तुओं के वेग का अध्ययन — न्यूटन/लाइबनिज से 500 वर्ष पहले' : 'Differential calculus: studied instantaneous velocity — 500 years before Newton/Leibniz'}</p>
          <p>→ {isHi ? 'चक्रीय द्विघात समीकरण: पेल समीकरण के समाधान — यूरोप से 600 वर्ष पहले' : 'Cyclic quadratic equations: solved Pell\'s equation — 600 years before Europe'}</p>
          <p>→ {isHi ? 'त्रिकोणमिति: sine और cosine योगफल और अंतर सूत्र' : 'Trigonometry: sine and cosine sum and difference formulas'}</p>
          <p>→ {isHi ? 'शून्य से भाग: n/0 = ∞ की अवधारणा पर चर्चा' : 'Division by zero: discussed the concept of n/0 = ∞'}</p>
          <p>→ {isHi ? 'गोलाकार पृथ्वी: पृथ्वी के गोलाकार आकार का स्पष्ट वर्णन' : 'Spherical Earth: explicit description of Earth\'s spherical shape'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ऐतिहासिक प्रासंगिकता' : 'Historical Context'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>1150 ईस्वी में — जब भास्कराचार्य लिख रहे थे — यूरोप गहरे मध्ययुगीन काल में था। विश्वविद्यालय अभी उभर रहे थे (बोलोग्ना 1088, ऑक्सफोर्ड 1096)। वैज्ञानिक विचार मुख्यतः धार्मिक प्रशासन के अधीन था। इसी समय भास्कराचार्य अवकलन गणित के पूर्वाभास, गुरुत्वाकर्षण, और उन्नत बीजगणित लिख रहे थे — यह भारतीय बौद्धिक परम्परा की जीवन्तता का प्रमाण है।</>
            : <>In 1150 CE — when Bhaskaracharya was writing — Europe was in the deep medieval period. Universities were just emerging (Bologna 1088, Oxford 1096). Scientific thought was largely under religious authority. At this same time, Bhaskaracharya was writing precursors to differential calculus, gravity, and advanced algebra — a testament to the vitality of the Indian intellectual tradition.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module26_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

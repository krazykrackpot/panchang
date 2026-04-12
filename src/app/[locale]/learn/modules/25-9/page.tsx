'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_25_9', phase: 11, topic: 'Mathematics', moduleNumber: '25.9',
  title: { en: 'Kerala School \u2014 When India Invented Calculus', hi: 'केरल स्कूल \u2014 जब भारत ने कलनशास्त्र की खोज की' },
  subtitle: {
    en: 'Madhava\'s infinite series for \u03C0, sine, cosine, and arctangent \u2014 with correction terms, worked examples, and the story of the world\'s first calculus textbook',
    hi: 'माधव की \u03C0, sine, cosine और arctangent के लिए अनन्त श्रेणी \u2014 सुधार पदों, हल किए गए उदाहरणों, और विश्व की पहली कलनशास्त्र पाठ्यपुस्तक की कहानी',
  },
  estimatedMinutes: 16,
  crossRefs: [
    { label: { en: 'Module 25-7: Calculus Overview', hi: 'मॉड्यूल 25-7: कलन सारांश' }, href: '/learn/modules/25-7' },
    { label: { en: 'Module 25-3: Pi = 3.1416', hi: 'मॉड्यूल 25-3: \u03C0 = 3.1416' }, href: '/learn/modules/25-3' },
    { label: { en: 'Module 25-2: Sine Is Sanskrit', hi: 'मॉड्यूल 25-2: ज्या से Sine' }, href: '/learn/modules/25-2' },
    { label: { en: 'Deep Dive: Kerala School', hi: 'गहन अध्ययन: केरल स्कूल' }, href: '/learn/contributions/kerala-school' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_9_01', type: 'mcq',
    question: {
      en: 'Who is considered the founder of the Kerala School of Mathematics, and approximately when did he work?',
      hi: 'केरल गणित विद्यालय के संस्थापक कौन माने जाते हैं, और उन्होंने लगभग कब कार्य किया?',
    },
    options: [
      { en: 'Aryabhata, ~500 CE', hi: 'आर्यभट, ~500 ई.' },
      { en: 'Madhava of Sangamagrama, ~1350 CE', hi: 'संगमग्राम के माधव, ~1350 ई.' },
      { en: 'Nilakantha Somayaji, ~1500 CE', hi: 'नीलकण्ठ सोमयाजी, ~1500 ई.' },
      { en: 'Brahmagupta, ~628 CE', hi: 'ब्रह्मगुप्त, ~628 ई.' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Madhava of Sangamagrama (~1340\u20131425 CE) from Irinjalakuda, Kerala, founded the school. He discovered infinite series for \u03C0, sin, cos, and arctan, and invented correction terms for series acceleration. His students carried the tradition forward for 200 years.',
      hi: 'संगमग्राम के माधव (~1340\u20131425 ई.) ने केरल के इरिंजलकुड़ा से इस स्कूल की स्थापना की। उन्होंने \u03C0, sin, cos और arctan के लिए अनन्त श्रेणियों की खोज की और श्रेणी-त्वरण के लिए सुधार पदों का आविष्कार किया।',
    },
  },
  {
    id: 'q25_9_02', type: 'mcq',
    question: {
      en: 'The series \u03C0/4 = 1 \u2212 1/3 + 1/5 \u2212 1/7 + ... is known in Western textbooks as the:',
      hi: '\u03C0/4 = 1 \u2212 1/3 + 1/5 \u2212 1/7 + ... श्रेणी को पश्चिमी पाठ्यपुस्तकों में कहा जाता है:',
    },
    options: [
      { en: 'Euler formula', hi: 'ऑयलर सूत्र' },
      { en: 'Leibniz formula', hi: 'लाइबनिज सूत्र' },
      { en: 'Newton formula', hi: 'न्यूटन सूत्र' },
      { en: 'Gauss formula', hi: 'गाउस सूत्र' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'It is called the "Leibniz formula for \u03C0" after Gottfried Leibniz who published it in 1674. However, Madhava derived this series around 1350 CE \u2014 approximately 324 years earlier. More accurately, it should be called the Madhava-Leibniz series.',
      hi: 'इसे गॉटफ्रीड लाइबनिज (1674) के नाम पर "लाइबनिज सूत्र" कहा जाता है। लेकिन माधव ने यह श्रेणी ~1350 ई. में व्युत्पन्न की \u2014 लगभग 324 वर्ष पहले। अधिक सटीक रूप से, इसे माधव-लाइबनिज श्रेणी कहा जाना चाहिए।',
    },
  },
  {
    id: 'q25_9_03', type: 'mcq',
    question: {
      en: 'Why is Madhava\'s discovery of correction terms for the \u03C0 series considered even more remarkable than the series itself?',
      hi: '\u03C0 श्रेणी के लिए माधव द्वारा सुधार पदों की खोज को श्रेणी से भी अधिक उल्लेखनीय क्यों माना जाता है?',
    },
    options: [
      { en: 'The correction terms make the series exact after 3 terms', hi: 'सुधार पद 3 पदों के बाद श्रेणी को सटीक बनाते हैं' },
      { en: 'They accelerate convergence, giving 11-decimal \u03C0 from just 50 terms', hi: 'वे अभिसरण को तेज़ करते हैं, केवल 50 पदों से 11-दशमलव \u03C0 देते हैं' },
      { en: 'They convert the series from alternating to monotone', hi: 'वे श्रेणी को प्रत्यावर्ती से एकदिशीय बनाते हैं' },
      { en: 'They allow computing \u03C0 without knowing its value', hi: 'वे \u03C0 के मान के बिना गणना करने देते हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The raw series converges extremely slowly \u2014 you need millions of terms for 6 correct decimals. Madhava\'s correction terms transform this: with just 50 terms plus correction, he achieved 11 correct decimal places. Europe did not develop comparable acceleration techniques until Euler in the 1740s, nearly 400 years later.',
      hi: 'कच्ची श्रेणी अत्यन्त धीमी अभिसरित होती है \u2014 6 सही दशमलव के लिए लाखों पदों की आवश्यकता। माधव के सुधार पद इसे बदल देते हैं: केवल 50 पदों और सुधार के साथ 11 सही दशमलव। यूरोप में ऑयलर (1740 के दशक) तक तुलनीय तकनीक विकसित नहीं हुई।',
    },
  },
  {
    id: 'q25_9_04', type: 'mcq',
    question: {
      en: 'The Yuktibhasha (~1530 CE) is significant because it:',
      hi: 'युक्तिभाषा (~1530 ई.) महत्त्वपूर्ण है क्योंकि:',
    },
    options: [
      { en: 'Was the first mathematical text written in Sanskrit', hi: 'यह संस्कृत में लिखा गया पहला गणितीय ग्रन्थ था' },
      { en: 'Contains the world\'s first complete proofs of infinite series results, written in Malayalam', hi: 'इसमें अनन्त श्रेणी परिणामों के विश्व के प्रथम पूर्ण प्रमाण हैं, मलयालम में' },
      { en: 'Was translated directly into Latin by Jesuits', hi: 'जेसुइट ने इसका सीधे लैटिन में अनुवाद किया' },
      { en: 'Contains only astronomical tables without derivations', hi: 'इसमें केवल खगोलीय सारणियाँ हैं, व्युत्पत्ति नहीं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jyeshthadeva\'s Yuktibhasha is arguably the world\'s first calculus textbook. Written in Malayalam (not Sanskrit) for wider accessibility, it contains detailed step-by-step proofs of all Kerala School results including the infinite series for \u03C0, sin, cos, and arctan. It derives these using geometric limit arguments equivalent to modern Riemann sums.',
      hi: 'ज्येष्ठदेव की युक्तिभाषा विश्व की पहली कलनशास्त्र पाठ्यपुस्तक है। व्यापक सुगम्यता के लिए मलयालम में लिखी गई, इसमें \u03C0, sin, cos और arctan की अनन्त श्रेणियों सहित सभी केरल परिणामों के विस्तृत चरणबद्ध प्रमाण हैं।',
    },
  },
  {
    id: 'q25_9_05', type: 'mcq',
    question: {
      en: 'Nilakantha Somayaji\'s Tantrasangraha (1500 CE) proposed a planetary model where:',
      hi: 'नीलकण्ठ सोमयाजी के तन्त्रसंग्रह (1500 ई.) ने एक ग्रहीय मॉडल प्रस्तावित किया जिसमें:',
    },
    options: [
      { en: 'All planets orbit Earth (fully geocentric)', hi: 'सभी ग्रह पृथ्वी की परिक्रमा करते हैं (पूर्ण भूकेन्द्री)' },
      { en: 'All planets orbit the Sun (fully heliocentric)', hi: 'सभी ग्रह सूर्य की परिक्रमा करते हैं (पूर्ण सौरकेन्द्री)' },
      { en: 'Mercury and Venus orbit the Sun, which orbits Earth', hi: 'बुध और शुक्र सूर्य की, सूर्य पृथ्वी की परिक्रमा करते हैं' },
      { en: 'Earth and Mars orbit the Sun, others orbit Earth', hi: 'पृथ्वी और मंगल सूर्य की, अन्य पृथ्वी की परिक्रमा करते हैं' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Nilakantha proposed that Mercury and Venus orbit the Sun, while the Sun orbits Earth \u2014 a partially heliocentric model. This is geometrically identical to the Tychonic system proposed by Tycho Brahe in 1588, a full 88 years later. Nilakantha\'s model correctly predicted Mercury and Venus positions better than any previous model.',
      hi: 'नीलकण्ठ ने प्रस्तावित किया कि बुध और शुक्र सूर्य की परिक्रमा करते हैं, जबकि सूर्य पृथ्वी की \u2014 आंशिक सौर-केन्द्रीय मॉडल। यह ब्राहे (1588) की टाइकोनिक प्रणाली से ज्यामितीय रूप से समरूप है, पूरे 88 वर्ष बाद।',
    },
  },
  {
    id: 'q25_9_06', type: 'mcq',
    question: {
      en: 'The sine series sin(x) = x \u2212 x\u00B3/3! + x\u2075/5! \u2212 ... is attributed in Western mathematics to:',
      hi: 'sine श्रेणी sin(x) = x \u2212 x\u00B3/3! + x\u2075/5! \u2212 ... का श्रेय पश्चिमी गणित में किसे दिया जाता है:',
    },
    options: [
      { en: 'Leibniz and Gregory', hi: 'लाइबनिज और ग्रेगरी' },
      { en: 'Taylor and Maclaurin', hi: 'टेलर और मैक्लॉरिन' },
      { en: 'Euler and Bernoulli', hi: 'ऑयलर और बरनूली' },
      { en: 'Descartes and Fermat', hi: 'देकार्त और फ़र्मा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The series is called the "Taylor series" (Brook Taylor, 1715) or "Maclaurin series" (Colin Maclaurin, 1742). Madhava derived it around 1400 CE \u2014 more than 300 years before either European mathematician. The Kerala texts contain not just the result but full proofs.',
      hi: 'इस श्रेणी को "टेलर श्रेणी" (ब्रुक टेलर, 1715) या "मैक्लॉरिन श्रेणी" (कॉलिन मैक्लॉरिन, 1742) कहा जाता है। माधव ने इसे ~1400 ई. में व्युत्पन्न किया \u2014 दोनों यूरोपीय गणितज्ञों से 300+ वर्ष पहले।',
    },
  },
  {
    id: 'q25_9_07', type: 'true_false',
    question: {
      en: 'Madhava used the substitution x = 1/\u221A3 in the arctangent series because it converges much faster than x = 1, enabling him to compute \u03C0 to high precision with fewer terms.',
      hi: 'माधव ने arctangent श्रेणी में x = 1/\u221A3 प्रतिस्थापन का उपयोग किया क्योंकि यह x = 1 से बहुत तेज़ अभिसरित होता है, जिससे कम पदों में \u03C0 की उच्च सटीकता सम्भव हुई।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. When x = 1, the series 1 \u2212 1/3 + 1/5 \u2212 ... converges extremely slowly. But with x = 1/\u221A3 (\u2248 0.577), each successive power shrinks much faster. This gives \u03C0/6 = arctan(1/\u221A3), and combined with correction terms, Madhava achieved 11-decimal accuracy from relatively few terms.',
      hi: 'सत्य। x = 1 पर श्रेणी अत्यन्त धीमी अभिसरित होती है। लेकिन x = 1/\u221A3 (\u2248 0.577) के साथ, प्रत्येक क्रमिक घात बहुत तेज़ी से घटती है। इससे \u03C0/6 = arctan(1/\u221A3) मिलता है, और सुधार पदों के साथ माधव ने कम पदों से 11-दशमलव सटीकता प्राप्त की।',
    },
  },
  {
    id: 'q25_9_08', type: 'true_false',
    question: {
      en: 'The Jesuit missionaries in Kerala have been conclusively proven to have transmitted Kerala mathematical results to Europe before Newton.',
      hi: 'केरल में जेसुइट मिशनरियों ने न्यूटन से पहले केरल गणितीय परिणामों को यूरोप तक पहुँचाया \u2014 यह निर्णायक रूप से प्रमाणित हो चुका है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. While circumstantial evidence is suggestive (Jesuits were in Kerala from ~1540, had access to manuscripts, and the timing aligns), no direct "smoking gun" documentary proof has been found. The scholarly debate remains open. What is beyond debate: the Kerala School achieved these results 250\u2013340 years before their European counterparts.',
      hi: 'असत्य। परिस्थितिजन्य साक्ष्य संकेतपूर्ण हैं (जेसुइट ~1540 से केरल में थे, पाण्डुलिपियों तक पहुँच थी), लेकिन कोई प्रत्यक्ष निर्णायक दस्तावेज़ी प्रमाण नहीं मिला। विद्वत्-बहस जारी है। जो बहस से परे है: केरल स्कूल ने ये परिणाम यूरोपीय समकक्षों से 250\u2013340 वर्ष पहले प्राप्त किए।',
    },
  },
  {
    id: 'q25_9_09', type: 'mcq',
    question: {
      en: 'Parameshvara (~1360\u20131455 CE) is notable for conducting the longest systematic astronomical observation program in pre-telescopic history. How many years did it span?',
      hi: 'परमेश्वर (~1360\u20131455 ई.) दूरबीन-पूर्व इतिहास में सबसे लम्बा व्यवस्थित खगोलीय प्रेक्षण कार्यक्रम चलाने के लिए उल्लेखनीय हैं। यह कितने वर्षों तक चला?',
    },
    options: [
      { en: '10 years', hi: '10 वर्ष' },
      { en: '25 years', hi: '25 वर्ष' },
      { en: '55 years', hi: '55 वर्ष' },
      { en: '100 years', hi: '100 वर्ष' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Parameshvara conducted 55 years of continuous, systematic astronomical observations \u2014 the most extensive observational program before the invention of the telescope. He used these empirical data to create the Drigganita system, which corrected planetary positions based on actual observations rather than inherited theoretical models.',
      hi: 'परमेश्वर ने 55 वर्षों तक निरन्तर, व्यवस्थित खगोलीय प्रेक्षण किए \u2014 दूरबीन के आविष्कार से पहले सबसे व्यापक प्रेक्षण कार्यक्रम। उन्होंने इन अनुभवजन्य आँकड़ों से दृग्गणित प्रणाली बनाई।',
    },
  },
  {
    id: 'q25_9_10', type: 'mcq',
    question: {
      en: 'Using Madhava\'s sine series, what is sin(30\u00B0) computed to with just the first three terms (x, \u2212x\u00B3/3!, +x\u2075/5!)?',
      hi: 'माधव की sine श्रेणी के पहले तीन पदों (x, \u2212x\u00B3/3!, +x\u2075/5!) से sin(30\u00B0) की गणना का परिणाम क्या है?',
    },
    options: [
      { en: '0.47 (not very close)', hi: '0.47 (बहुत करीब नहीं)' },
      { en: '0.50001 (nearly exact)', hi: '0.50001 (लगभग सटीक)' },
      { en: '0.52 (too high)', hi: '0.52 (बहुत अधिक)' },
      { en: '0.49 (close but needs more terms)', hi: '0.49 (करीब लेकिन और पदों की ज़रूरत)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'With x = \u03C0/6 \u2248 0.5236: Term 1 = 0.5236, Term 2 = \u22120.02392, Term 3 = +0.00033. Sum = 0.50001, which is nearly exactly 0.5 (the true value of sin 30\u00B0). Just three terms of Madhava\'s series give five-decimal accuracy for this angle.',
      hi: 'x = \u03C0/6 \u2248 0.5236 के साथ: पद 1 = 0.5236, पद 2 = \u22120.02392, पद 3 = +0.00033। योग = 0.50001, जो लगभग ठीक 0.5 है (sin 30\u00B0 का वास्तविक मान)। माधव की श्रेणी के केवल तीन पदों से पाँच-दशमलव सटीकता।',
    },
  },
];

/* ================================================================ */
/*  PAGE 1 — The Series That Changed Everything                       */
/* ================================================================ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'संगमग्राम से विश्व तक' : 'From Sangamagrama to the World'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>1350 और 1550 ई. के बीच, केरल के एक छोटे गाँव में गणितज्ञों की एक वंश-परम्परा ने वह हासिल किया जो असम्भव लगता था। बिना छापाखाने, बिना विश्वविद्यालय, बिना अन्तर्राष्ट्रीय संचार के \u2014 उन्होंने अनन्त श्रेणियाँ खोजीं, \u03C0 का 11 दशमलव तक मान निकाला, और कलनशास्त्र की नींव रखी। यह सब न्यूटन और लाइबनिज से 250\u2013340 वर्ष पहले हुआ।</>
            : <>Between 1350 and 1550 CE, in a small village in Kerala, a lineage of mathematicians achieved what seemed impossible. Without printing presses, without universities, without international communication \u2014 they discovered infinite series, computed \u03C0 to 11 decimal places, and laid the foundations of calculus. All of this happened 250\u2013340 years before Newton and Leibniz.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'माधव-लाइबनिज \u03C0 श्रेणी' : 'The Madhava-Leibniz \u03C0 Series'}
        </h4>
        <p className="text-gold-light text-lg font-mono text-center mb-3">&pi;/4 = 1 &minus; 1/3 + 1/5 &minus; 1/7 + ...</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {isHi
            ? <>इसका अर्थ: 1 जोड़ो, 1/3 घटाओ, 1/5 जोड़ो, 1/7 घटाओ... यह अनन्त तक चलता है। लेकिन कच्ची श्रेणी बहुत धीमी है \u2014 1,000 पदों के बाद भी केवल 2 सही दशमलव मिलते हैं।</>
            : <>This means: add 1, subtract 1/3, add 1/5, subtract 1/7... and continue forever. But the raw series is painfully slow \u2014 even after 1,000 terms, you only get 2 correct decimals.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>माधव की प्रतिभा यह थी कि उन्होंने <span className="text-emerald-300 font-semibold">सुधार पद</span> का आविष्कार किया। N पदों का योग करने के बाद एक सुधार कारक जोड़ने से \u2014 केवल 50 पदों से \u03C0 का 11 दशमलव तक सटीक मान मिलता है। यूरोप ने तुलनीय तकनीक ~400 वर्ष बाद विकसित की।</>
            : <>Madhava&apos;s genius was inventing <span className="text-emerald-300 font-semibold">correction terms</span>. By adding a correction factor after summing N terms \u2014 just 50 terms yield \u03C0 accurate to 11 decimal places. Europe developed comparable techniques ~400 years later.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'Sine और Cosine श्रेणी' : 'The Sine and Cosine Series'}
        </h4>
        <p className="text-gold-light text-base font-mono text-center mb-2">sin(x) = x &minus; x&sup3;/3! + x&#8309;/5! &minus; ...</p>
        <p className="text-gold-light text-base font-mono text-center mb-3">cos(x) = 1 &minus; x&sup2;/2! + x&#8308;/4! &minus; ...</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>पश्चिम में इन्हें "Taylor/Maclaurin series" कहा जाता है (टेलर 1715, मैक्लॉरिन 1742)। माधव ने ~1400 ई. में \u2014 300+ वर्ष पहले \u2014 इन्हें व्युत्पन्न किया।</>
            : <>In the West, these are called "Taylor/Maclaurin series" (Taylor 1715, Maclaurin 1742). Madhava derived them ~1400 CE \u2014 300+ years earlier.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-emerald-300 font-medium">सत्यापन:</span> sin(30\u00B0) = sin(\u03C0/6): पद 1 = 0.5236, पद 2 = \u22120.0239, पद 3 = +0.0003 \u2192 योग = 0.5000 \u2714 (केवल 3 पदों से पाँच-दशमलव सटीकता!)</>
            : <><span className="text-emerald-300 font-medium">Verification:</span> sin(30\u00B0) = sin(\u03C0/6): Term 1 = 0.5236, Term 2 = \u22120.0239, Term 3 = +0.0003 \u2192 Sum = 0.5000 \u2714 (five-decimal accuracy from just 3 terms!)</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'तेज़ अभिसरण की चतुराई' : 'The Clever Trick for Fast Convergence'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>arctan(x) = x \u2212 x\u00B3/3 + x\u2075/5 \u2212 ... श्रेणी में x = 1 रखने पर \u03C0/4 मिलता है, लेकिन बहुत धीमा। माधव ने x = 1/\u221A3 चुना, जिससे \u03C0/6 = arctan(1/\u221A3) मिलता है \u2014 और प्रत्येक पद तेज़ी से घटता है। इस चतुराई से कम पदों में उच्च सटीकता सम्भव हुई।</>
            : <>The arctan(x) = x \u2212 x\u00B3/3 + x\u2075/5 \u2212 ... series with x = 1 gives \u03C0/4, but converges slowly. Madhava chose x = 1/\u221A3, giving \u03C0/6 = arctan(1/\u221A3) \u2014 where each term shrinks much faster. This clever substitution enabled high precision from fewer terms.</>}
        </p>
      </section>
    </div>
  );
}

/* ================================================================ */
/*  PAGE 2 — The People and the Textbook                              */
/* ================================================================ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'प्रतिभा की वंश-परम्परा' : 'A Lineage of Genius'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>माधव अकेले नहीं थे। उनकी परम्परा पाँच पीढ़ियों तक चली, प्रत्येक गणितज्ञ ने पिछले के कार्य को आगे बढ़ाया।</>
            : <>Madhava was not alone. His tradition lasted five generations, each mathematician building on the previous one&apos;s work.</>}
        </p>
      </section>

      {[
        { name: { en: 'Parameshvara', hi: 'परमेश्वर' }, years: '~1360\u20131455', fact: { en: '55 years of systematic astronomical observations \u2014 longest pre-telescopic program', hi: '55 वर्ष व्यवस्थित खगोलीय प्रेक्षण \u2014 दूरबीन-पूर्व सबसे लम्बा कार्यक्रम' } },
        { name: { en: 'Nilakantha Somayaji', hi: 'नीलकण्ठ सोमयाजी' }, years: '~1444\u20131544', fact: { en: 'Tantrasangraha (1500 CE): partial heliocentric model \u2014 Mercury & Venus orbit Sun. Identical to Brahe\'s model, 88 years before Brahe.', hi: 'तन्त्रसंग्रह (1500 ई.): आंशिक सौर-केन्द्रीय मॉडल \u2014 बुध और शुक्र सूर्य की परिक्रमा। ब्राहे से 88 वर्ष पहले।' } },
        { name: { en: 'Jyeshthadeva', hi: 'ज्येष्ठदेव' }, years: '~1500\u20131575', fact: { en: 'Yuktibhasha (~1530 CE): world\'s first calculus textbook. Full proofs in Malayalam. Derives series using geometric limits (Riemann sums).', hi: 'युक्तिभाषा (~1530 ई.): विश्व की पहली कलन पाठ्यपुस्तक। मलयालम में पूर्ण प्रमाण। ज्यामितीय सीमाओं (रीमान योग) से श्रेणी व्युत्पत्ति।' } },
        { name: { en: 'Achyuta Pisharati', hi: 'अच्युत पिशारटि' }, years: '~1550\u20131621', fact: { en: 'Last major figure. Applied tropical corrections. Extended the tradition before colonial pressures caused its decline.', hi: 'अन्तिम प्रमुख व्यक्ति। उष्णकटिबन्धीय सुधार लागू किए। औपनिवेशिक दबावों से पतन से पहले परम्परा बढ़ाई।' } },
      ].map((person, i) => (
        <section key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gold-light font-semibold text-sm">{isHi ? person.name.hi : person.name.en}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-dark">{person.years} CE</span>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">{isHi ? person.fact.hi : person.fact.en}</p>
        </section>
      ))}

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'संचरण प्रश्न' : 'The Transmission Question'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>क्या ये परिणाम यूरोप पहुँचे? जेसुइट मिशनरी 1540 के दशक से केरल में थे, उनकी पाण्डुलिपियों तक पहुँच थी, और समय-रेखा संकेतपूर्ण है। लेकिन कोई निर्णायक प्रमाण नहीं मिला।</>
            : <>Did these results reach Europe? Jesuit missionaries were in Kerala from the 1540s, had access to manuscripts, and the timeline is suggestive. But no conclusive proof has been found.</>}
        </p>
        <p className="text-emerald-300 text-xs leading-relaxed font-semibold">
          {isHi
            ? 'जो बहस से परे है: केरल स्कूल ने ये परिणाम 250\u2013340 वर्ष पहले प्राप्त किए।'
            : 'What is beyond debate: the Kerala School achieved these results 250\u2013340 years earlier.'}
        </p>
      </section>
    </div>
  );
}

/* ================================================================ */
/*  PAGE 3 — The Living Legacy                                        */
/* ================================================================ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'जीवित विरासत' : 'The Living Legacy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>इस पंचांग ऐप की हर गणना के पीछे केरल स्कूल का गणित है। सूर्य/चन्द्र देशान्तर, सूर्योदय/अस्त, ग्रहण समय \u2014 सब माधव की sine/cosine श्रेणियों पर आधारित हैं।</>
            : <>Behind every computation in this Panchang app lies Kerala School mathematics. Sun/Moon longitude, sunrise/sunset, eclipse timing \u2014 all built on Madhava&apos;s sine/cosine series.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'नाम बदलने का समय' : 'Time to Rename'}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-1.5 pr-3">{isHi ? 'पश्चिमी नाम' : 'Western Name'}</th>
                <th className="text-left text-gold-light py-1.5 pr-3">{isHi ? 'केरल खोजकर्ता' : 'Kerala Discoverer'}</th>
                <th className="text-right text-gold-light py-1.5">{isHi ? 'अन्तर' : 'Gap'}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { w: 'Leibniz series', k: 'Madhava', g: '~324 yrs' },
                { w: 'Gregory-Leibniz arctan', k: 'Madhava', g: '~321 yrs' },
                { w: 'Taylor/Maclaurin series', k: 'Madhava', g: '~365 yrs' },
                { w: 'Newton\'s sine series', k: 'Madhava', g: '~316 yrs' },
                { w: 'Euler\'s acceleration', k: 'Madhava', g: '~390 yrs' },
                { w: 'Tychonic model', k: 'Nilakantha', g: '88 yrs' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/8">
                  <td className="py-1.5 pr-3 text-text-secondary">{row.w}</td>
                  <td className="py-1.5 pr-3 text-emerald-400 font-semibold">{row.k}</td>
                  <td className="text-right py-1.5 text-amber-400 font-bold">{row.g}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'निर्णायक तर्क' : 'The Definitive Argument'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>यदि आप sin(x) = x \u2212 x\u00B3/6 + x\u2075/120 \u2212 ... लिख सकते हैं, तो आप समझते हैं कि प्रत्येक पद पिछले का अवकलज है। गुणांक 1/n! बार-बार अवकलन से आता है। यही कलनशास्त्र है \u2014 चाहे आप इसे वह नाम दें या न दें। केरल स्कूल के पास यह सब था, प्रमाणों के साथ, न्यूटन के जन्म से शताब्दियों पहले।</>
            : <>If you can write sin(x) = x \u2212 x\u00B3/6 + x\u2075/120 \u2212 ..., you understand that each term is the derivative of the previous. The coefficient 1/n! arises from repeated differentiation. This IS calculus \u2014 whether or not you call it that. The Kerala School had all of this, with proofs, centuries before Newton was born.</>}
        </p>
      </section>

      <section className="p-4 rounded-xl bg-gold-primary/6 border-l-4 border-gold-primary/50">
        <p className="text-gold-light text-xs font-semibold mb-1">{isHi ? 'गहन अध्ययन' : 'Deep Dive'}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>अभिसरण सारणी, हल किए गए उदाहरण, और विस्तृत गणितीय व्युत्पत्ति के लिए हमारा पूर्ण केरल स्कूल पृष्ठ देखें।</>
            : <>For convergence tables, worked examples, and detailed mathematical derivations, see our full Kerala School contribution page.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_9Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

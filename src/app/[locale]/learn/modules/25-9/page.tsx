'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-9.json';

const META: ModuleMeta = {
  id: 'mod_25_9', phase: 11, topic: 'Mathematics', moduleNumber: '25.9',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 16,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-7' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-3' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-2' },
    { label: L.crossRefs[3].label as Record<string, string>, href: '/learn/contributions/kerala-school' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_9_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_07', type: 'true_false',
    question: L.questions[6].question as Record<string, string>,
    correctAnswer: 2,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_08', type: 'true_false',
    question: L.questions[7].question as Record<string, string>,
    correctAnswer: 2,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_09', type: 'mcq',
    question: L.questions[8].question as Record<string, string>,
    options: L.questions[8].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_9_10', type: 'mcq',
    question: L.questions[9].question as Record<string, string>,
    options: L.questions[9].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[9].explanation as Record<string, string>,
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
          {tl({ en: 'From Sangamagrama to the World', hi: 'संगमग्राम से विश्व तक', sa: 'संगमग्राम से विश्व तक' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>1350 और 1550 ई. के बीच, केरल के एक छोटे गाँव में गणितज्ञों की एक वंश-परम्परा ने वह हासिल किया जो असम्भव लगता था। बिना छापाखाने, बिना विश्वविद्यालय, बिना अन्तर्राष्ट्रीय संचार के \u2014 उन्होंने अनन्त श्रेणियाँ खोजीं, \u03C0 का 11 दशमलव तक मान निकाला, और कलनशास्त्र की नींव रखी। यह सब न्यूटन और लाइबनिज से 250\u2013340 वर्ष पहले हुआ।</>
            : <>Between 1350 and 1550 CE, in a small village in Kerala, a lineage of mathematicians achieved what seemed impossible. Without printing presses, without universities, without international communication \u2014 they discovered infinite series, computed \u03C0 to 11 decimal places, and laid the foundations of calculus. All of this happened 250\u2013340 years before Newton and Leibniz.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Madhava-Leibniz \u03C0 Series', hi: 'माधव-लाइबनिज \u03C0 श्रेणी', sa: 'माधव-लाइबनिज \u03C0 श्रेणी' }, locale)}
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
          {tl({ en: 'The Sine and Cosine Series', hi: 'Sine और Cosine श्रेणी', sa: 'Sine और Cosine श्रेणी' }, locale)}
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
          {tl({ en: 'The Clever Trick for Fast Convergence', hi: 'तेज़ अभिसरण की चतुराई', sa: 'तेज़ अभिसरण की चतुराई' }, locale)}
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
          {tl({ en: 'A Lineage of Genius', hi: 'प्रतिभा की वंश-परम्परा', sa: 'प्रतिभा की वंश-परम्परा' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>माधव अकेले नहीं थे। उनकी परम्परा पाँच पीढ़ियों तक चली, प्रत्येक गणितज्ञ ने पिछले के कार्य को आगे बढ़ाया।</>
            : <>Madhava was not alone. His tradition lasted five generations, each mathematician building on the previous one&apos;s work.</>}
        </p>
      </section>

      {[
        { name: { en: 'Parameshvara', hi: 'परमेश्वर', sa: 'परमेश्वरः', mai: 'परमेश्वर', mr: 'परमेश्वर', ta: 'பரமேஸ்வரர்', te: 'పరమేశ్వరుడు', bn: 'পরমেশ্বর', kn: 'ಪರಮೇಶ್ವರ', gu: 'પરમેશ્વર' }, years: '~1360\u20131455', fact: { en: '55 years of systematic astronomical observations \u2014 longest pre-telescopic program', hi: '55 वर्ष व्यवस्थित खगोलीय प्रेक्षण \u2014 दूरबीन-पूर्व सबसे लम्बा कार्यक्रम', sa: '55 वर्षाणि व्यवस्थिताः ज्योतिषप्रेक्षणाः \u2014 दूरदर्शनपूर्वं दीर्घतमः कार्यक्रमः', mai: '55 वर्ष व्यवस्थित खगोलीय प्रेक्षण \u2014 दूरबीन-पूर्व सबसँ लम्बा कार्यक्रम', mr: '55 वर्षे पद्धतशीर खगोलशास्त्रीय निरीक्षणे \u2014 दुर्बिणीपूर्व सर्वात दीर्घ कार्यक्रम', ta: '55 ஆண்டுகள் முறையான வானியல் அவதானிப்புகள் \u2014 தொலைநோக்கிக்கு முந்தைய மிக நீண்ட திட்டம்', te: '55 సంవత్సరాల క్రమబద్ధ ఖగోళ పరిశీలనలు \u2014 దూరదర్శిని ముందు అత్యంత సుదీర్ఘ కార్యక్రమం', bn: '55 বছরের পদ্ধতিগত জ্যোতির্বিজ্ঞান পর্যবেক্ষণ \u2014 দূরবীক্ষণ-পূর্ব দীর্ঘতম কার্যক্রম', kn: '55 ವರ್ಷಗಳ ವ್ಯವಸ್ಥಿತ ಖಗೋಳ ವೀಕ್ಷಣೆಗಳು \u2014 ದೂರದರ್ಶಕ-ಪೂರ್ವ ಅತಿ ದೀರ್ಘ ಕಾರ್ಯಕ್ರಮ', gu: '55 વર્ષ વ્યવસ્થિત ખગોળીય અવલોકન \u2014 ટેલિસ્કોપ-પૂર્વ સૌથી લાંબો કાર્યક્રમ' } },
        { name: { en: 'Nilakantha Somayaji', hi: 'नीलकण्ठ सोमयाजी', sa: 'नीलकण्ठसोमयाजी', mai: 'नीलकण्ठ सोमयाजी', mr: 'नीलकंठ सोमयाजी', ta: 'நீலகண்ட சோமயாஜி', te: 'నీలకంఠ సోమయాజి', bn: 'নীলকণ্ঠ সোমযাজী', kn: 'ನೀಲಕಂಠ ಸೋಮಯಾಜಿ', gu: 'નીલકંઠ સોમયાજી' }, years: '~1444\u20131544', fact: { en: 'Tantrasangraha (1500 CE): partial heliocentric model \u2014 Mercury & Venus orbit Sun. Identical to Brahe\'s model, 88 years before Brahe.', hi: 'तन्त्रसंग्रह (1500 ई.): आंशिक सौर-केन्द्रीय मॉडल \u2014 बुध और शुक्र सूर्य की परिक्रमा। ब्राहे से 88 वर्ष पहले।' } },
        { name: { en: 'Jyeshthadeva', hi: 'ज्येष्ठदेव', sa: 'ज्येष्ठदेवः', mai: 'ज्येष्ठदेव', mr: 'ज्येष्ठदेव', ta: 'ஜ்யேஷ்டதேவர்', te: 'జ్యేష్ఠదేవుడు', bn: 'জ্যেষ্ঠদেব', kn: 'ಜ್ಯೇಷ್ಠದೇವ', gu: 'જ્યેષ્ઠદેવ' }, years: '~1500\u20131575', fact: { en: 'Yuktibhasha (~1530 CE): world\'s first calculus textbook. Full proofs in Malayalam. Derives series using geometric limits (Riemann sums).', hi: 'युक्तिभाषा (~1530 ई.): विश्व की पहली कलन पाठ्यपुस्तक। मलयालम में पूर्ण प्रमाण। ज्यामितीय सीमाओं (रीमान योग) से श्रेणी व्युत्पत्ति।' } },
        { name: { en: 'Achyuta Pisharati', hi: 'अच्युत पिशारटि', sa: 'अच्युतपिशारटिः', mai: 'अच्युत पिशारटि', mr: 'अच्युत पिशारटी', ta: 'அச்சுத பிஷாரடி', te: 'అచ్యుత పిషారటి', bn: 'অচ্যুত পিশারটি', kn: 'ಅಚ್ಯುತ ಪಿಶಾರಟಿ', gu: 'અચ્યુત પિશારટી' }, years: '~1550\u20131621', fact: { en: 'Last major figure. Applied tropical corrections. Extended the tradition before colonial pressures caused its decline.', hi: 'अन्तिम प्रमुख व्यक्ति। उष्णकटिबन्धीय सुधार लागू किए। औपनिवेशिक दबावों से पतन से पहले परम्परा बढ़ाई।', sa: 'अन्तिमः प्रमुखः। उष्णकटिबन्धीयसंशोधनानि प्रयुक्तानि। औपनिवेशिकदबावात् पतनात् पूर्वं परम्परा विस्तारिता।', mai: 'अन्तिम प्रमुख व्यक्ति। उष्णकटिबन्धीय सुधार लागू कएल। औपनिवेशिक दबाव सँ पतन सँ पहिने परम्परा बढ़ाओल।', mr: 'शेवटची प्रमुख व्यक्ती। उष्णकटिबंधीय दुरुस्त्या लागू केल्या। वसाहतवादी दबावांमुळे ऱ्हास होण्यापूर्वी परंपरा पुढे नेली।', ta: 'கடைசி முக்கிய நபர். வெப்பமண்டல திருத்தங்களைப் பயன்படுத்தினார். காலனித்துவ அழுத்தங்களால் வீழ்ச்சி ஏற்படுவதற்கு முன் பாரம்பரியத்தை நீட்டினார்.', te: 'చివరి ప్రముఖ వ్యక్తి. ఉష్ణమండల సవరణలు అన్వయించారు. వలసవాద ఒత్తిళ్ల వల్ల క్షీణత చెందక ముందు సంప్రదాయాన్ని విస్తరించారు.', bn: 'শেষ প্রধান ব্যক্তি। গ্রীষ্মমণ্ডলীয় সংশোধন প্রয়োগ করেছেন। ঔপনিবেশিক চাপের কারণে পতনের আগে ঐতিহ্য প্রসারিত করেছেন।', kn: 'ಕೊನೆಯ ಪ್ರಮುಖ ವ್ಯಕ್ತಿ. ಉಷ್ಣವಲಯ ತಿದ್ದುಪಡಿಗಳನ್ನು ಅನ್ವಯಿಸಿದರು. ವಸಾಹತುಶಾಹಿ ಒತ್ತಡಗಳಿಂದ ಅವನತಿ ಹೊಂದುವ ಮೊದಲು ಸಂಪ್ರದಾಯವನ್ನು ವಿಸ್ತರಿಸಿದರು.', gu: 'છેલ્લી મુખ્ય વ્યક્તિ. ઉષ્ણકટિબંધીય સુધારા લાગુ કર્યા. વસાહતી દબાણને કારણે પતન થતાં પહેલાં પરંપરા વિસ્તારી.' } },
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
          {tl({ en: 'The Transmission Question', hi: 'संचरण प्रश्न', sa: 'संचरण प्रश्न' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>क्या ये परिणाम यूरोप पहुँचे? जेसुइट मिशनरी 1540 के दशक से केरल में थे, उनकी पाण्डुलिपियों तक पहुँच थी, और समय-रेखा संकेतपूर्ण है। लेकिन कोई निर्णायक प्रमाण नहीं मिला।</>
            : <>Did these results reach Europe? Jesuit missionaries were in Kerala from the 1540s, had access to manuscripts, and the timeline is suggestive. But no conclusive proof has been found.</>}
        </p>
        <p className="text-emerald-300 text-xs leading-relaxed font-semibold">
          {tl({ en: 'What is beyond debate: the Kerala School achieved these results 250\u2013340 years earlier.', hi: 'जो बहस से परे है: केरल स्कूल ने ये परिणाम 250\u2013340 वर्ष पहले प्राप्त किए।', sa: 'जो बहस से परे है: केरल स्कूल ने ये परिणाम 250\u2013340 वर्ष पहले प्राप्त किए।' }, locale)}
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
          {tl({ en: 'The Living Legacy', hi: 'जीवित विरासत', sa: 'जीवित विरासत' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>इस पंचांग ऐप की हर गणना के पीछे केरल स्कूल का गणित है। सूर्य/चन्द्र देशान्तर, सूर्योदय/अस्त, ग्रहण समय \u2014 सब माधव की sine/cosine श्रेणियों पर आधारित हैं।</>
            : <>Behind every computation in this Panchang app lies Kerala School mathematics. Sun/Moon longitude, sunrise/sunset, eclipse timing \u2014 all built on Madhava&apos;s sine/cosine series.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Time to Rename', hi: 'नाम बदलने का समय', sa: 'नाम बदलने का समय' }, locale)}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-1.5 pr-3">{tl({ en: 'Western Name', hi: 'पश्चिमी नाम', sa: 'पाश्चात्यं नाम' }, locale)}</th>
                <th className="text-left text-gold-light py-1.5 pr-3">{tl({ en: 'Kerala Discoverer', hi: 'केरल खोजकर्ता', sa: 'केरल-अन्वेषकः' }, locale)}</th>
                <th className="text-right text-gold-light py-1.5">{tl({ en: 'Gap', hi: 'अन्तर', sa: 'अन्तरालः' }, locale)}</th>
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
          {tl({ en: 'The Definitive Argument', hi: 'निर्णायक तर्क', sa: 'निर्णायक तर्क' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>यदि आप sin(x) = x \u2212 x\u00B3/6 + x\u2075/120 \u2212 ... लिख सकते हैं, तो आप समझते हैं कि प्रत्येक पद पिछले का अवकलज है। गुणांक 1/n! बार-बार अवकलन से आता है। यही कलनशास्त्र है \u2014 चाहे आप इसे वह नाम दें या न दें। केरल स्कूल के पास यह सब था, प्रमाणों के साथ, न्यूटन के जन्म से शताब्दियों पहले।</>
            : <>If you can write sin(x) = x \u2212 x\u00B3/6 + x\u2075/120 \u2212 ..., you understand that each term is the derivative of the previous. The coefficient 1/n! arises from repeated differentiation. This IS calculus \u2014 whether or not you call it that. The Kerala School had all of this, with proofs, centuries before Newton was born.</>}
        </p>
      </section>

      <section className="p-4 rounded-xl bg-gold-primary/6 border-l-4 border-gold-primary/50">
        <p className="text-gold-light text-xs font-semibold mb-1">{tl({ en: 'Deep Dive', hi: 'गहन अध्ययन', sa: 'गहन अध्ययन' }, locale)}</p>
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

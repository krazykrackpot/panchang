'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-8.json';

const META: ModuleMeta = {
  id: 'mod_25_8', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.8',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-2' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_8_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 1,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_8_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Sulba Sutras and Baudhayana's Theorem                 */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'वह प्रमेय जिसे हम गलत नाम से जानते हैं' : "The Theorem We Know By the Wrong Name"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>a² + b² = c². दुनिया के हर स्कूल में यह "पाइथागोरस प्रमेय" के रूप में पढ़ाई जाती है। लेकिन इस परिणाम का सबसे पुराना ज्ञात कथन ग्रीस में नहीं, भारत में मिलता है — बौधायन शुल्ब सूत्र में, जो ~800 ईपू में लिखा गया। पाइथागोरस ~570 ईपू में पैदा हुए — लगभग 230 वर्ष बाद।</>
            : <>a² + b² = c². Taught in every school worldwide as 'Pythagoras's theorem.' But the earliest known statement of this result appears not in Greece, but in India — in the Baudhayana Sulba Sutra, written ~800 BCE. Pythagoras was born ~570 BCE — roughly 230 years later.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'शुल्ब सूत्र — कर्मकाण्ड से जन्मा गणित' : "Sulba Sutras — Mathematics Born From Ritual"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {isHi
            ? <>शुल्ब सूत्र वेदों के परिशिष्ट हैं जो अग्निकुण्ड निर्माण की ज्यामिति बताते हैं। "शुल्ब" का अर्थ है रस्सी — ये रस्सी-और-खूँटी ज्यामिति की पुस्तिकाएँ थीं। वेदी का आकार (बाज, कछुआ, चक्र) और क्षेत्रफल बिल्कुल सटीक होना चाहिए था — धार्मिक नियम ने गणितीय परिशुद्धता की माँग की।</>
            : <>The Sulba Sutras are Vedic appendices giving the geometry for fire altar construction. "Sulba" means rope — literally rope-and-peg geometry manuals. Altars had to be specific shapes (falcon, tortoise, wheel) with exact areas — ritual law demanded mathematical precision. Any deviation was considered invalid.</>}
        </p>
        <div className="space-y-2">
          {[
            { name: 'Baudhayana', date: '~800 BCE', note: { en: 'Oldest — contains verse 1.48, the general theorem', hi: 'सबसे पुराना — श्लोक 1.48, सामान्य प्रमेय', sa: 'प्राचीनतमम् — श्लोकः 1.48, सामान्यप्रमेयम्', mai: 'सबसँ पुरान — श्लोक 1.48, सामान्य प्रमेय', mr: 'सर्वात जुने — श्लोक 1.48, सामान्य प्रमेय', ta: 'மிகப் பழமையானது — பாடல் 1.48, பொதுத் தேற்றம்', te: 'అత్యంత పురాతనమైనది — శ్లోకం 1.48, సాధారణ సిద్ధాంతం', bn: 'প্রাচীনতম — শ্লোক 1.48, সাধারণ উপপাদ্য', kn: 'ಅತ್ಯಂತ ಪ್ರಾಚೀನ — ಶ್ಲೋಕ 1.48, ಸಾಮಾನ್ಯ ಪ್ರಮೇಯ', gu: 'સૌથી પ્રાચીન — શ્લોક 1.48, સામાન્ય પ્રમેય' }, accent: '#f0d48a' },
            { name: 'Apastamba', date: '~600 BCE', note: { en: 'Refined √2, additional constructions', hi: 'परिष्कृत √2', sa: 'परिष्कृतं √2 मूल्यम्', mai: 'परिष्कृत √2, अतिरिक्त निर्माण', mr: 'परिष्कृत √2, अतिरिक्त रचना', ta: 'மேம்படுத்தப்பட்ட √2, கூடுதல் கட்டுமானங்கள்', te: 'మెరుగైన √2, అదనపు నిర్మాణాలు', bn: 'পরিমার্জিত √2, অতিরিক্ত নির্মাণ', kn: 'ಪರಿಷ್ಕೃತ √2, ಹೆಚ್ಚುವರಿ ನಿರ್ಮಾಣಗಳು', gu: 'પરિષ્કૃત √2, વધારાનાં બાંધકામ' }, accent: '#fbbf24' },
            { name: 'Katyayana', date: '~300 BCE', note: { en: 'Generalised geometric transformations', hi: 'सामान्यीकृत रूपांतरण', sa: 'सामान्यीकृतानि ज्यामितीयरूपान्तराणि', mai: 'सामान्यीकृत ज्यामितीय रूपांतरण', mr: 'सामान्यीकृत भूमितीय रूपांतरण', ta: 'பொதுமைப்படுத்தப்பட்ட வடிவியல் மாற்றங்கள்', te: 'సాధారణీకరించిన జ్యామితీయ రూపాంతరాలు', bn: 'সাধারণীকৃত জ্যামিতিক রূপান্তর', kn: 'ಸಾಮಾನ್ಯೀಕೃತ ಜ್ಯಾಮಿತೀಯ ಪರಿವರ್ತನೆಗಳು', gu: 'સામાન્યીકૃત ભૌમિતિક રૂપાંતરણ' }, accent: '#a78bfa' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs font-mono w-16 flex-shrink-0" style={{ color: s.accent }}>{s.date}</span>
              <div>
                <span className="text-text-primary text-xs font-semibold">{s.name} Sulba Sutra — </span>
                <span className="text-text-secondary text-xs">{isHi ? s.note.hi : s.note.en}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'बौधायन शुल्ब सूत्र 1.48' : "Baudhayana Sulba Sutra 1.48"}
        </h4>
        <p
          className="text-gold-primary text-base font-bold mb-2 leading-relaxed text-center"
          style={{ fontFamily: 'var(--font-devanagari-heading)' }}
        >
          दीर्घचतुरश्रस्याक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत्पृथग्भूते कुरुतस्तदुभयं करोति
        </p>
        <p className="text-gold-light/80 text-sm italic text-center mb-1">
          {isHi
            ? '"आयत का विकर्ण वह दोनों [क्षेत्रफल] उत्पन्न करता है जो उसकी लम्बाई और चौड़ाई अलग-अलग उत्पन्न करती हैं।"'
            : '"The diagonal of a rectangle produces both [areas] which its length and breadth produce separately."'}
        </p>
        <p className="text-text-secondary/60 text-xs text-center">
          {isHi ? '= a² + b² = c² — सभी आयतों के लिए सामान्य नियम' : '= a² + b² = c² — a general rule for ALL rectangles'}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — √2, Pythagorean Triples, and Altar Geometry              */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? '√2, त्रिक और वेदी ज्यामिति' : '√2, Triples, and Altar Geometry'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रमेय के अलावा, बौधायन ने दो और उल्लेखनीय योगदान दिए: √2 का आश्चर्यजनक रूप से सटीक सन्निकटन, और विशिष्ट पाइथागोरीय त्रिकों की सूची। दोनों सीधे अग्निकुण्ड निर्माण के व्यावहारिक आवश्यकताओं से उभरे।</>
            : <>Beyond the theorem itself, Baudhayana made two more remarkable contributions: an astonishingly accurate approximation of √2, and a list of specific Pythagorean triples. Both emerged directly from the practical demands of fire altar construction.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '√2 — 800 ईपू में पाँच दशमलव' : '√2 — Five Decimal Places in 800 BCE'}
        </h4>
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-center mb-3">
          <p className="text-amber-300 font-mono text-sm font-bold">√2 ≈ 1 + 1/3 + 1/(3×4) − 1/(3×4×34)</p>
          <p className="text-text-secondary text-xs mt-1">= 1.4142156... (modern: 1.4142135...)</p>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>यह सन्निकटन क्यों? क्योंकि वर्गाकार वेदी को दोगुना करने के लिए मूल का विकर्ण चाहिए — जो s√2 है। यदि आप s = 1 की वेदी से शुरू करते हैं, तो नई भुजा = √2 है। बिना सटीक √2 के, दोगुनी वेदी ठीक नहीं होती।</>
            : <>Why this approximation? Because doubling a square altar requires its diagonal — which is s√2. Starting from an altar of side s=1, the new side = √2. Without accurate √2, the doubled altar isn't right.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'बौधायन का मान आधुनिक मान से केवल 0.0000021 अलग है। अपस्तम्ब शुल्ब सूत्र (~600 ईपू) ने इसे और परिष्कृत किया।'
            : "Baudhayana's value differs from the modern IEEE 754 value by only 0.0000021. Apastamba Sulba Sutra (~600 BCE) refined it further."}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'पाइथागोरीय त्रिक — वेदी में समकोण' : "Pythagorean Triples — Right Angles for the Altar"}
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { a: 3, b: 4, c: 5, check: '9+16=25' },
            { a: 5, b: 12, c: 13, check: '25+144=169' },
            { a: 8, b: 15, c: 17, check: '64+225=289' },
            { a: 7, b: 24, c: 25, check: '49+576=625' },
          ].map((t, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
              <p className="text-gold-light font-bold text-sm">({t.a}, {t.b}, {t.c})</p>
              <p className="text-text-secondary text-xs font-mono">{t.check}</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'इन त्रिकों का व्यावहारिक उपयोग: लम्बाई (a+b+c) की रस्सी में a और a+b पर गाँठें बाँधें, तीनों खूँटों पर फैलाएँ — एक सटीक समकोण बनता है। यही प्राचीन निर्माणकर्ता समकोण बनाते थे।'
            : 'Practical use: tie a rope of length (a+b+c) with knots at a and a+b, stretch on three pegs — a perfect right angle. This is how ancient builders made right angles without modern instruments.'}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Pythagoras, Euclid, and the Fair Assessment               */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'पाइथागोरस ने वास्तव में क्या किया?' : "What Did Pythagoras Actually Do?"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पाइथागोरस (~570–495 ईपू) ने मिस्र और बेबीलोनिया की व्यापक यात्रा की। ग्रीक परम्परा उन्हें प्रमेय के प्रथम औपचारिक निगमनात्मक प्रमाण का श्रेय देती है। लेकिन समस्या: पाइथागोरस का स्वयं का कोई लिखित कार्य नहीं बचा। उनसे सम्बन्धित सब कुछ बाद के लेखकों से आता है।</>
            : <>Pythagoras (~570–495 BCE) travelled extensively to Egypt and Babylon. Greek tradition credits him with the first formal deductive proof of the theorem. But the problem: not a single written work by Pythagoras himself survives. Everything attributed to him comes from later writers.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'कालक्रम' : 'The Timeline'}
        </h4>
        <div className="space-y-3">
          {[
            { year: '~800 BCE', event: { en: 'Baudhayana Sulba Sutra — general theorem, √2, and triples', hi: 'बौधायन शुल्ब सूत्र — सामान्य प्रमेय, √2, और त्रिक', sa: 'बौधायनशुल्बसूत्रम् — सामान्यप्रमेयम्, √2, त्रिकाणि च', mai: 'बौधायन शुल्ब सूत्र — सामान्य प्रमेय, √2, आ त्रिक', mr: 'बौधायन शुल्बसूत्र — सामान्य प्रमेय, √2, आणि त्रिक', ta: 'பௌதாயன சுல்ப சூத்திரம் — பொதுத் தேற்றம், √2, மற்றும் முத்தொகைகள்', te: 'బౌధాయన శుల్బ సూత్రం — సాధారణ సిద్ధాంతం, √2, మరియు త్రిపుటులు', bn: 'বৌধায়ন শুল্ব সূত্র — সাধারণ উপপাদ্য, √2, ও ত্রিক', kn: 'ಬೌಧಾಯನ ಶುಲ್ಬ ಸೂತ್ರ — ಸಾಮಾನ್ಯ ಪ್ರಮೇಯ, √2, ಮತ್ತು ತ್ರಿಕಗಳು', gu: 'બૌધાયન શુલ્બ સૂત્ર — સામાન્ય પ્રમેય, √2, અને ત્રિક' }, color: '#f0d48a' },
            { year: '~600 BCE', event: { en: 'Apastamba Sulba Sutra — refined √2', hi: 'आपस्तम्ब शुल्ब सूत्र — परिष्कृत √2', sa: 'आपस्तम्बशुल्बसूत्रम् — परिष्कृतं √2 मूल्यम्', mai: 'आपस्तम्ब शुल्ब सूत्र — परिष्कृत √2', mr: 'आपस्तंब शुल्बसूत्र — परिष्कृत √2', ta: 'ஆபஸ்தம்ப சுல்ப சூத்திரம் — மேம்படுத்தப்பட்ட √2', te: 'ఆపస్తంబ శుల్బ సూత్రం — మెరుగైన √2', bn: 'আপস্তম্ব শুল্ব সূত্র — পরিমার্জিত √2', kn: 'ಆಪಸ್ತಂಬ ಶುಲ್ಬ ಸೂತ್ರ — ಪರಿಷ್ಕೃತ √2', gu: 'આપસ્તંબ શુલ્બ સૂત્ર — પરિષ્કૃત √2' }, color: '#d4a853' },
            { year: '~570 BCE', event: { en: 'Pythagoras born in Samos, Greece', hi: 'पाइथागोरस का जन्म सामोस, ग्रीस में', sa: 'पाइथागोरसस्य जन्म सामोसद्वीपे, ग्रीसदेशे', mai: 'पाइथागोरसक जन्म सामोस, ग्रीस मे', mr: 'पायथागोरसचा जन्म सामोस, ग्रीस येथे', ta: 'பைதாகரஸ் சாமோஸ், கிரேக்கத்தில் பிறந்தார்', te: 'పైథాగరస్ సామోస్, గ్రీస్‌లో జన్మించారు', bn: 'পাইথাগোরাস সামোসে, গ্রিসে জন্মগ্রহণ করেন', kn: 'ಪೈಥಾಗರಸ್ ಸಾಮೋಸ್, ಗ್ರೀಸ್‌ನಲ್ಲಿ ಜನಿಸಿದರು', gu: 'પાયથાગોરસનો જન્મ સામોસ, ગ્રીસમાં' }, color: '#a78bfa' },
            { year: '~300 BCE', event: { en: "Euclid's Elements — first surviving formal Greek proof", hi: 'यूक्लिड के Elements — पहला जीवित औपचारिक ग्रीक प्रमाण', sa: 'यूक्लिडस्य एलिमेण्ट्स् — प्रथमं जीवितं औपचारिकं ग्रीकप्रमाणम्', mai: 'यूक्लिडक एलिमेण्ट्स — पहिल जीवित औपचारिक ग्रीक प्रमाण', mr: 'युक्लिडचे एलिमेंट्स — पहिला जिवंत औपचारिक ग्रीक पुरावा', ta: 'யூக்ளிடின் எலிமெண்ட்ஸ் — முதல் எஞ்சியிருக்கும் முறையான கிரேக்க நிரூபணம்', te: 'యూక్లిడ్ ఎలిమెంట్స్ — మొదటి మిగిలిన అధికారిక గ్రీక్ నిరూపణ', bn: 'ইউক্লিডের এলিমেন্টস — প্রথম টিকে থাকা আনুষ্ঠানিক গ্রিক প্রমাণ', kn: 'ಯೂಕ್ಲಿಡ್‌ನ ಎಲಿಮೆಂಟ್ಸ್ — ಮೊದಲ ಉಳಿದಿರುವ ಔಪಚಾರಿಕ ಗ್ರೀಕ್ ಪ್ರಮಾಣ', gu: 'યુક્લિડના એલિમેન્ટ્સ — પ્રથમ ટકેલો ઔપચારિક ગ્રીક પ્રમાણ' }, color: '#34d399' },
            { year: '499 CE', event: { en: 'Aryabhatiya — theorem used for astronomical calculations', hi: 'आर्यभटीय — खगोलीय गणनाओं में प्रमेय', sa: 'आर्यभटीयम् — ज्योतिषगणनासु प्रमेयस्य उपयोगः', mai: 'आर्यभटीय — खगोलीय गणना मे प्रमेय', mr: 'आर्यभटीय — खगोलशास्त्रीय गणनेत प्रमेय', ta: 'ஆர்யபடீயம் — வானியல் கணக்கீடுகளுக்குப் பயன்படுத்தப்பட்ட தேற்றம்', te: 'ఆర్యభటీయం — ఖగోళ గణనలలో ఉపయోగించబడిన సిద్ధాంతం', bn: 'আর্যভটীয় — জ্যোতির্বিদ্যা গণনায় ব্যবহৃত উপপাদ্য', kn: 'ಆರ್ಯಭಟೀಯ — ಖಗೋಳ ಗಣನೆಗಳಲ್ಲಿ ಬಳಸಿದ ಪ್ರಮೇಯ', gu: 'આર્યભટીય — ખગોળીય ગણતરીઓમાં ઉપયોગી પ્રમેય' }, color: '#fbbf24' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs font-mono w-16 flex-shrink-0 mt-0.5" style={{ color: item.color }}>{item.year}</span>
              <p className="text-text-secondary text-xs leading-relaxed">{isHi ? item.event.hi : item.event.en}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'निष्पक्ष मूल्यांकन' : 'The Fair Assessment'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'भारतीय योगदान:' : 'Indian contribution:'}</span>{' '}
            {isHi
              ? 'सामान्य प्रमेय की खोज और व्यावहारिक उपयोग (~800 ईपू), √2 पाँच दशमलव तक, चार पाइथागोरीय त्रिक।'
              : 'Discovery and systematic practical use of the general theorem (~800 BCE), √2 to 5 decimal places, four Pythagorean triples.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'ग्रीक योगदान:' : 'Greek contribution:'}</span>{' '}
            {isHi
              ? 'सम्भवतः प्रथम औपचारिक निगमनात्मक प्रमाण — हालाँकि पाइथागोरस का कोई लिखित कार्य नहीं बचा, इसलिए यूक्लिड (~300 ईपू) ही सबसे पुराना जीवित स्रोत है।'
              : 'Possibly the first formal deductive proof — though no work by Pythagoras survives, so Euclid (~300 BCE) is the oldest surviving source.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed mt-2 italic">
            {isHi
              ? 'गणित के इतिहासकार अब "बौधायन प्रमेय" नाम की ओर झुक रहे हैं। भारतीय गणित पाठ्यपुस्तकों में यह पहले से ही "बौधायन प्रमेय" कही जाती है।'
              : 'Historians of mathematics increasingly favour the name "Baudhayana theorem." Indian mathematics textbooks already call it that.'}
          </p>
        </div>
      </section>
    </div>
  );
}

export default function Module25_8Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

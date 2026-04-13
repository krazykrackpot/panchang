'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/26-1.json';

const META: ModuleMeta = {
  id: 'mod_26_1', phase: 6, topic: 'Indian Contributions', moduleNumber: '26.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/26-2' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/26-3' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q26_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q26_1_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Aryabhata's Declaration                                    */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
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
  const isHi = isDevanagariLocale(locale);
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
  const isHi = isDevanagariLocale(locale);
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
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

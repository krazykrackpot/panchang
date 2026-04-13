'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-4.json';

const META: ModuleMeta = {
  id: 'mod_25_4', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.4',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 11,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-5' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_4_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_4_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Brahmagupta's Negative Number Rules                        */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'ब्रह्मगुप्त के ऋण संख्या नियम (628 ई.)' : "Brahmagupta's Negative Number Rules (628 CE)"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>628 ई. में ब्रह्मगुप्त ने जो किया वह क्रान्तिकारी था: उन्होंने एक ऐसी संख्या की कल्पना की जो "कुछ नहीं" से कम है। धन (सम्पत्ति) से ऋण (कर्ज) — यह गणितीय छलाँग थी जो यूरोप को 1000 वर्ष बाद भी डरा रही थी।</>
            : <>What Brahmagupta did in 628 CE was revolutionary: he imagined a number less than "nothing." From dhana (assets) to rina (debt) — this was a mathematical leap that would frighten Europe for another 1000 years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'धन और ऋण — ब्रह्मगुप्त के 628 ई. के नियम' : 'Dhana and Rina — Brahmagupta\'s Rules (628 CE)'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'जोड़:' : 'Addition:'}</span>{' '}
            {isHi ? 'धन + धन = धन। ऋण + ऋण = ऋण। धन + ऋण = उनके अन्तर की दिशा।' : 'dhana + dhana = dhana. rina + rina = rina. dhana + rina = the sign of the larger magnitude.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'घटाव:' : 'Subtraction:'}</span>{' '}
            {isHi ? 'ऋण में से ऋण घटाना = धन या ऋण (जो बड़ा)। धन में से ऋण घटाना = धन।' : 'rina − rina = dhana or rina (whichever is larger). dhana − rina = dhana.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'गुणा:' : 'Multiplication:'}</span>{' '}
            {isHi ? 'धन × धन = धन। ऋण × ऋण = धन। धन × ऋण = ऋण।' : 'dhana × dhana = dhana. rina × rina = dhana. dhana × rina = rina.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'शून्य के साथ:' : 'With zero:'}</span>{' '}
            {isHi ? 'शून्य + ऋण = ऋण। शून्य − ऋण = धन। शून्य × ऋण = शून्य।' : 'zero + rina = rina. zero − rina = dhana. zero × rina = zero.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'व्यापार से गणित तक — ऋण का जन्म' : 'From Commerce to Mathematics — Birth of Debt'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>भारतीय व्यापारी हजारों वर्षों से खाता-बहियों में धन (सम्पत्ति) और ऋण (कर्ज) अलग-अलग दर्ज करते थे। दो रंगों की स्याही — काली धन के लिए, लाल ऋण के लिए — का उपयोग होता था। "लाल में होना" (in the red) आज भी अंग्रेजी में घाटे का प्रतीक है।</>
            : <>Indian merchants had recorded dhana (assets) and rina (debts) in account books for millennia. Two colours of ink — black for assets, red for debts — were used. "Being in the red" remains an English idiom for being in deficit, a direct inheritance of this accounting tradition.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>ब्रह्मगुप्त ने इस व्यावहारिक लेखांकन को गणितीय भाषा दी। "मेरी शुद्ध सम्पत्ति क्या है यदि मेरे पास 5 स्वर्ण हैं लेकिन मैं 8 स्वर्ण का ऋणी हूँ?" → 5 + (−8) = −3। सरल, व्यावहारिक, क्रान्तिकारी।</>
            : <>Brahmagupta gave this practical accounting a mathematical language. "What is my net worth if I have 5 gold but owe 8 gold?" → 5 + (−8) = −3. Simple, practical, revolutionary.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Europe's 1000-Year Delay                                   */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'यूरोप की 1000 वर्ष की देरी' : "Europe's 1000-Year Delay"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारत में 628 ई. में जो स्वीकृत था, यूरोप में उसे 18वीं-19वीं शताब्दी तक "असत्य" और "बेतुका" कहा जाता रहा। यह देरी क्यों? ग्रीक गणित का ज्यामितीय विश्व-दृष्टिकोण।</>
            : <>What was accepted in India in 628 CE was called "false" and "absurd" in Europe until the 18th–19th centuries. Why the delay? The geometric worldview of Greek mathematics.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'यूरोपीय विरोध की समयरेखा' : 'Timeline of European Resistance'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">~250 BCE — Diophantus:</span>{' '}
            {isHi ? 'ऋण समाधानों को "बेतुका" (absurd) कहकर अस्वीकार किया।' : 'Rejected negative solutions to equations as "absurd."'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">1202 CE — Fibonacci:</span>{' '}
            {isHi ? 'लिबर अबाची में ऋण संख्याओं का सीमित उपयोग (ऋण के रूप में) — लेकिन पूरी तरह स्वीकृति नहीं।' : 'Limited use of negative numbers in Liber Abaci (as debts) — but no full acceptance.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">1637 — Descartes:</span>{' '}
            {isHi ? '"असत्य मूल" (fausses racines) — ऋण बीजगणितीय मूलों को अस्वीकृत।' : '"False roots" (fausses racines) — rejected negative algebraic roots.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">1759 — Maseres:</span>{' '}
            {isHi ? '"काल्पनिक" — ऋण संख्याएँ वास्तविक नहीं।' : '"Fictitious" — negative numbers not real.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">1796 — Frend:</span>{' '}
            {isHi ? 'ऋण संख्याओं को पूरी तरह अस्वीकार करने वाला ग्रन्थ लिखा।' : 'Wrote a treatise rejecting negative numbers entirely.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">~1850 CE:</span>{' '}
            {isHi ? 'कठोर संख्या सिद्धान्त के साथ अन्ततः यूरोपीय स्वीकृति।' : 'Final European acceptance with rigorous number theory.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'यूरोप ने विरोध क्यों किया?' : 'Why Did Europe Resist?'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">ज्यामितीय बाधा:</span> ग्रीक गणित में संख्याएँ = लम्बाइयाँ। एक ऋण लम्बाई भौतिक रूप से असम्भव है। "−3 मीटर" की एक छड़ी नहीं बना सकते।</>
            : <><span className="text-gold-light font-medium">Geometric barrier:</span> In Greek mathematics, numbers = lengths. A negative length is physically impossible. You can't make a stick of "−3 metres."</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भारतीय समाधान:</span> संख्याएँ = राशियाँ (quantities), न कि लम्बाइयाँ। कर्ज एक वास्तविक राशि है, भले ही इसे आप शारीरिक रूप से नहीं पकड़ सकते। यह अमूर्त सोच की जीत थी।</>
            : <><span className="text-gold-light font-medium">Indian solution:</span> Numbers = quantities, not lengths. A debt is a real quantity, even if you can't physically hold it. This was a triumph of abstract thinking over physical intuition.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Legacy in Algebra and Modern Mathematics                   */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'बीजगणित और आधुनिक गणित में विरासत' : 'Legacy in Algebra and Modern Mathematics'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ब्रह्मगुप्त के ऋण संख्या नियम आज के बीजगणित की रीढ़ हैं। उनके बिना, समीकरण हल करना, कलन, और आधुनिक भौतिकी असम्भव होती।</>
            : <>Brahmagupta's negative number rules are the backbone of modern algebra. Without them, equation solving, calculus, and modern physics would be impossible.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक अनुप्रयोग' : 'Modern Applications'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'बैंकिंग और वित्त:' : 'Banking and finance:'}</span>{' '}
            {isHi ? 'बैलेंस शीट, ऋण, ब्याज — सब ऋण संख्याओं पर। ब्रह्मगुप्त का "धन-ऋण" आज की पूरी वित्तीय प्रणाली में है।' : 'Balance sheets, loans, interest — all on negative numbers. Brahmagupta\'s "dhana-rina" is in today\'s entire financial system.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'भौतिकी:' : 'Physics:'}</span>{' '}
            {isHi ? 'विद्युत आवेश (+/−), ऊर्जा स्तर, तापमान (°C नीचे शून्य) — सब ऋण संख्याओं के बिना असम्भव।' : 'Electric charge (+/−), energy levels, temperature (°C below zero) — all impossible without negative numbers.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'कम्प्यूटर विज्ञान:' : 'Computer science:'}</span>{' '}
            {isHi ? 'Two\'s complement — कम्प्यूटर में ऋण संख्याओं का बाइनरी प्रतिनिधित्व। हर CPU में।' : 'Two\'s complement — binary representation of negative numbers in computers. In every CPU.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'जटिल संख्याएँ:' : 'Complex numbers:'}</span>{' '}
            {isHi ? '√(−1) = i — जटिल संख्याओं का आधार। क्वांटम यान्त्रिकी और विद्युत इंजीनियरिंग की नींव।' : '√(−1) = i — the basis of complex numbers. The foundation of quantum mechanics and electrical engineering.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'महावीर और भास्कर का योगदान' : "Mahavira's and Bhaskara's Contributions"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>9वीं शताब्दी में महावीर ने ब्रह्मगुप्त के नियमों का विस्तार किया — श्रेढ़ी, क्रमचय और संचय में ऋण राशियाँ। उन्होंने ऋण संख्याओं के वर्गमूल के साथ भी संघर्ष किया — जटिल संख्याओं की ओर पहला कदम।</>
            : <>In the 9th century, Mahavira extended Brahmagupta's rules — applying negative quantities to series, permutations, and combinations. He also wrestled with square roots of negative numbers — a first step toward complex numbers.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>12वीं शताब्दी में भास्कर द्वितीय ने और आगे बढ़ाया — बीजगणित में ऋण मूलों को पूरी तरह स्वीकार करते हुए। उनकी "बीजगणित" (Bijaganita) आधुनिक बीजगणित की प्रत्यक्ष पूर्वज है।</>
            : <>In the 12th century, Bhaskara II advanced further — fully accepting negative roots in algebra. His "Bijaganita" is a direct ancestor of modern algebra.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

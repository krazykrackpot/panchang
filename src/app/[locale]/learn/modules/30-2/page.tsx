'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/30-2.json';

const META: ModuleMeta = {
  id: 'mod_30_2', phase: 9, topic: 'Classical Texts', moduleNumber: '30.2',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/30-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/30-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q30_2_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q30_2_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q30_2_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
];

/* ---- Key Phaladeepika chapters (hoisted) ---- */
const PD_CHAPTERS = [
  { ch: '1', topic: 'Planetary & Sign Nature', topicHi: 'ग्रह और राशि स्वभाव' },
  { ch: '2', topic: 'Signs — Properties & Results', topicHi: 'राशियाँ — गुण और फल' },
  { ch: '3-4', topic: 'Planets in 12 Houses', topicHi: 'बारह भावों में ग्रह' },
  { ch: '5', topic: 'Planetary Combinations (Yogas)', topicHi: 'ग्रहीय संयोजन (योग)' },
  { ch: '6', topic: 'Rajayogas', topicHi: 'राजयोग' },
  { ch: '7', topic: 'Arishta (Inauspicious Yogas)', topicHi: 'अरिष्ट (अशुभ योग)' },
  { ch: '15', topic: 'Dasha Interpretation', topicHi: 'दशा व्याख्या' },
  { ch: '25', topic: 'Female Horoscopy (Stri Jataka)', topicHi: 'स्त्री ज्योतिष (स्त्री जातक)' },
  { ch: '28', topic: 'Final Chapter — Synthesis', topicHi: 'अन्तिम अध्याय — संश्लेषण' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Lamp That Lights Results', hi: 'फलों को प्रकाशित करने वाला दीप', sa: 'फलों को प्रकाशित करने वाला दीप' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>फलदीपिका (Phaladeepika) 13वीं शताब्दी में मन्त्रेश्वर द्वारा रचित एक उत्कृष्ट होरा ग्रन्थ है। "फल" = परिणाम/फल, "दीपिका" = दीप — अर्थात "फलों को प्रकाशित करने वाला दीप।" यह 28 अध्यायों में कुण्डली विश्लेषण की कला को सुलभ और व्यावहारिक रूप में प्रस्तुत करता है। जहाँ BPHS विश्वकोश है, फलदीपिका एक केन्द्रित, कार्यमूलक मार्गदर्शिका है — "इस ग्रह की इस भाव में स्थिति का क्या फल है?" इसका सीधा उत्तर देती है।</>
            : <>Phaladeepika, written by Mantreshwara in the 13th century CE, is an exquisite hora text. &quot;Phala&quot; = result/fruit, &quot;Deepika&quot; = lamp — meaning &quot;The Lamp That Illuminates Results.&quot; In 28 chapters, it presents the art of chart interpretation in an accessible, practical form. Where BPHS is an encyclopedia, Phaladeepika is a focused, action-oriented guide — it directly answers &quot;what is the result of this planet in this house?&quot;</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Key Chapters', hi: 'प्रमुख अध्याय', sa: 'प्रमुख अध्याय' }, locale)}
        </h4>
        <div className="space-y-1.5">
          {PD_CHAPTERS.map((row, i) => (
            <p key={i} className="text-text-secondary text-xs leading-relaxed">
              <span className="text-gold-light font-semibold">Ch. {row.ch}:</span>{' '}
              {isHi ? row.topicHi : row.topic}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Planet-in-House Results', hi: 'भाव में ग्रह के फल', sa: 'भाव में ग्रह के फल' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>फलदीपिका के अध्याय 3-4 इसके सबसे बहुमूल्य खण्ड हैं। प्रत्येक ग्रह (सूर्य से केतु) के प्रत्येक भाव (1 से 12) में स्थित होने के विस्तृत फल दिए गए हैं — 9 ग्रह × 12 भाव = 108 विस्तृत वर्णन। मन्त्रेश्वर की विशेषता यह है कि वे केवल फल नहीं बताते, बल्कि "क्यों" भी समझाते हैं — ग्रह की प्रकृति और भाव के कारकत्व का तर्कसंगत सम्बन्ध स्थापित करते हैं।</>
            : <>Chapters 3-4 of Phaladeepika are its most valuable sections. Detailed results are given for each planet (Sun through Ketu) placed in each house (1st through 12th) — 9 planets x 12 houses = 108 detailed descriptions. Mantreshwara&apos;s hallmark is that he doesn&apos;t just state results but explains &quot;why&quot; — establishing a logical connection between the planet&apos;s nature and the house&apos;s significations.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Example: Sun in the 10th House', hi: 'उदाहरण: दशम भाव में सूर्य', sa: 'उदाहरण: दशम भाव में सूर्य' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>फलदीपिका कहती है: "दशम भाव में सूर्य वाला व्यक्ति राजकीय सेवा, उच्च पद, और पिता के समान प्रभावशाली होता है। वह धर्मात्मा, यशस्वी, और कर्मठ होता है।" मन्त्रेश्वर स्पष्ट करते हैं कि ऐसा इसलिए है क्योंकि सूर्य = अधिकार, और 10वाँ भाव = कर्म/सार्वजनिक जीवन — दोनों का संयोग स्वाभाविक रूप से शक्तिशाली है। इस प्रकार का तर्कसंगत दृष्टिकोण रटने की आवश्यकता समाप्त करता है।</>
            : <>Phaladeepika states: &quot;One with the Sun in the 10th house attains royal service, high position, and becomes influential like the father. They are righteous, famous, and hardworking.&quot; Mantreshwara explains this is because Sun = authority, and the 10th house = karma/public life — their combination is naturally powerful. This logical approach eliminates the need for rote memorization.</>}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Why Phaladeepika Endures', hi: 'फलदीपिका क्यों अमर है', sa: 'फलदीपिका क्यों अमर है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>700+ वर्षों के बाद भी फलदीपिका अभ्यासी ज्योतिषियों की प्रिय पुस्तक क्यों है? तीन कारण: (1) संक्षिप्तता — 28 अध्यायों में वह सब है जो दैनिक अभ्यास में चाहिए, जबकि BPHS 100 अध्यायों में फैला है; (2) स्पष्टता — मन्त्रेश्वर की संस्कृत सरल और सुन्दर है, जटिल विषयों को भी सुबोध बनाती है; (3) व्यावहारिकता — यह सिद्धान्त से अधिक अभ्यास पर केन्द्रित है।</>
            : <>Why is Phaladeepika still the favorite book of practicing astrologers after 700+ years? Three reasons: (1) Conciseness — everything needed for daily practice in 28 chapters, while BPHS spans 100; (2) Clarity — Mantreshwara&apos;s Sanskrit is simple and elegant, making even complex topics accessible; (3) Practicality — it focuses on applied prediction more than theory.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-blue-500/15 rounded-xl p-5">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Phaladeepika vs BPHS — When to Use Which', hi: 'फलदीपिका बनाम BPHS — कब कौन सा उपयोग करें', sa: 'फलदीपिका बनाम BPHS — कब कौन सा उपयोग करें' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>BPHS = जब आपको किसी नियम का मूल स्रोत, वर्ग विभाजन का सटीक सूत्र, या दशा गणना की विधि चाहिए। फलदीपिका = जब आप किसी वास्तविक कुण्डली पढ़ रहे हैं और "इस ग्रह का इस भाव में क्या फल है?" जानना चाहते हैं। दोनों पूरक हैं — BPHS नींव है, फलदीपिका छत है। नींव के बिना छत खड़ी नहीं होती, और छत के बिना नींव निरर्थक है।</>
            : <>BPHS = when you need the original source of a rule, the exact formula for varga division, or the method of dasha calculation. Phaladeepika = when you are reading an actual chart and want to know &quot;what is the result of this planet in this house?&quot; Both are complementary — BPHS is the foundation, Phaladeepika is the roof. A foundation without a roof is incomplete, and a roof without a foundation cannot stand.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module30_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

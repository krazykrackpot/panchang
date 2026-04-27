'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/30-1.json';

const META: ModuleMeta = {
  id: 'mod_30_1', phase: 9, topic: 'Classical Texts', moduleNumber: '30.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/16-2' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/30-2' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q30_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q30_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q30_1_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q30_1_04', type: 'true_false',
    question: L.questions[3].question as Record<string, string>,
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
];

/* ---- Key BPHS chapters (hoisted) ---- */
const BPHS_CHAPTERS = [
  { ch: '1-2', topic: 'Creation & Avatars of Vishnu', topicHi: 'सृष्टि और विष्णु अवतार' },
  { ch: '3-4', topic: 'Planetary Nature & Sign Characteristics', topicHi: 'ग्रह स्वभाव और राशि विशेषताएँ' },
  { ch: '5-6', topic: 'Planetary Dignities & Aspects', topicHi: 'ग्रह गरिमा और दृष्टि' },
  { ch: '7-16', topic: 'Divisional Charts (D1-D60)', topicHi: 'वर्ग चार्ट (D1-D60)' },
  { ch: '17-26', topic: 'House Significations (1st-12th)', topicHi: 'भाव कारकत्व (1-12)' },
  { ch: '27-36', topic: 'Yogas & Rajayogas', topicHi: 'योग और राजयोग' },
  { ch: '37-45', topic: 'Planetary States & Strengths', topicHi: 'ग्रह अवस्थाएँ और बल' },
  { ch: '46-52', topic: 'Dasha Systems', topicHi: 'दशा पद्धतियाँ' },
  { ch: '53-80', topic: 'Advanced Topics & Special Lagnas', topicHi: 'उन्नत विषय और विशेष लग्न' },
  { ch: '81-100', topic: 'Remedies & Muhurta', topicHi: 'उपाय और मुहूर्त' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Foundation Text of Parashari Jyotish', hi: 'पाराशरी ज्योतिष का मूल ग्रन्थ', sa: 'पाराशरी ज्योतिष का मूल ग्रन्थ' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>बृहत् पाराशर होरा शास्त्र (BPHS) वैदिक ज्योतिष का सबसे महत्वपूर्ण और व्यापक ग्रन्थ है। यह महर्षि पाराशर और उनके शिष्य मैत्रेय के बीच संवाद के रूप में लगभग 100 अध्यायों में संरचित है। "होरा" शब्द "अहोरात्र" (दिन और रात) से निकला है — होरा शास्त्र = समय का विज्ञान। यह ग्रन्थ ग्रह स्वभाव, राशि गुण, वर्ग, दशा, योग, बल, और उपचार — ज्योतिष के लगभग हर विषय को कवर करता है।</>
            : <>Brihat Parashara Hora Shastra (BPHS) is the most important and comprehensive text of Vedic astrology. It is structured as a dialogue between Maharishi Parashara and his student Maitreya across approximately 100 chapters. The word &quot;Hora&quot; derives from &quot;Ahoratri&quot; (day and night) — Hora Shastra = the science of time. This text covers virtually every topic in Jyotish: planetary nature, sign qualities, vargas, dashas, yogas, strengths, and remedies.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Chapter Map of BPHS', hi: 'BPHS का अध्याय मानचित्र', sa: 'BPHS का अध्याय मानचित्र' }, locale)}
        </h4>
        <div className="space-y-1.5">
          {BPHS_CHAPTERS.map((row, i) => (
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
          {tl({ en: 'How to Read BPHS Effectively', hi: 'BPHS को प्रभावी ढंग से कैसे पढ़ें', sa: 'BPHS को प्रभावी ढंग से कैसे पढ़ें' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>BPHS को आरम्भ से अन्त तक पढ़ने का प्रयास एक सामान्य गलती है — यह एक उपन्यास नहीं, एक विश्वकोश है। प्रभावी दृष्टिकोण: पहले अध्याय 3-4 (ग्रह गुण और राशि स्वभाव) को पूर्ण रूप से समझें — यह सम्पूर्ण ज्योतिष का आधार है। फिर अध्याय 17-26 (भाव कारकत्व) पढ़ें — प्रत्येक भाव के अर्थ और उसमें ग्रहों के फल। इसके बाद अध्याय 46-52 (दशा) और 27-36 (योग) पर जाएँ।</>
            : <>A common mistake is trying to read BPHS from start to finish — it is an encyclopedia, not a novel. The effective approach: first thoroughly understand Chapters 3-4 (planetary qualities and sign nature) — this is the foundation of all Jyotish. Then read Chapters 17-26 (house significations) — the meaning of each house and results of planets in them. After that, move to Chapters 46-52 (dashas) and 27-36 (yogas).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Commentary Tradition', hi: 'टीका परम्परा', sa: 'टीका परम्परा' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>BPHS को बिना टीका (भाष्य) के पढ़ना कठिन है क्योंकि मूल श्लोक अत्यन्त संक्षिप्त हैं। प्रमुख अंग्रेजी अनुवाद: गिरीश चन्द्र शर्मा (2 खण्ड) और आर. सन्थानम का अनुवाद। हिन्दी में: सीताराम झा का भाष्य। प्रत्येक टीकाकार अपनी परम्परा से व्याख्या करता है — इसलिए एक से अधिक टीका पढ़ना महत्वपूर्ण है। जब दो टीकाकार भिन्न व्याख्या दें, तो मूल श्लोक पर लौटें।</>
            : <>Reading BPHS without commentary (bhashya) is challenging because the original shlokas are extremely concise. Key English translations: Girish Chandra Sharma (2 volumes) and R. Santhanam&apos;s translation. Each commentator interprets from their tradition — so reading multiple commentaries is important. When two commentators disagree, return to the original shloka and apply the rules to real charts to see which interpretation holds.</>}
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
          {tl({ en: 'BPHS in Modern Practice', hi: 'आधुनिक अभ्यास में BPHS', sa: 'आधुनिक अभ्यास में BPHS' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आधुनिक ज्योतिष में BPHS का महत्व अटल है। जब भी किसी योग, दशा फल, या ग्रहीय नियम पर विवाद हो, BPHS अन्तिम सन्दर्भ होता है। हमारा ज्योतिष इंजन — कुण्डली गणना, योग पहचान, दशा गणना, और शड्बल — सभी BPHS के नियमों पर आधारित हैं। जब हमने मूलत्रिकोण अंश, ग्रह मैत्री सारणी, या उच्च-नीच अंश में विसंगति पाई, तो BPHS अध्याय 3-4 ही प्रामाणिक स्रोत बना।</>
            : <>In modern practice, BPHS&apos;s importance is unshakeable. Whenever there is a dispute about a yoga, dasha result, or planetary rule, BPHS is the final reference. Our Jyotish engine — kundali computation, yoga detection, dasha calculation, and shadbala — is all based on BPHS rules. When we found discrepancies in moolatrikona degrees, planetary friendship tables, or exaltation-debilitation degrees, BPHS Chapters 3-4 was the authoritative source.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Authorship Question', hi: 'रचयिता प्रश्न', sa: 'रचयिता प्रश्न' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>विद्वानों में BPHS के रचनाकाल पर मतभेद है। परम्परा के अनुसार यह महर्षि पाराशर (वेद व्यास के पिता) की रचना है और इसकी तिथि अत्यन्त प्राचीन है। आधुनिक शोध सुझाता है कि वर्तमान संस्करण 7वीं-8वीं शताब्दी ई. का संकलन है जो पुरानी मौखिक परम्पराओं को एकत्रित करता है। यह विवाद ग्रन्थ के मूल्य को कम नहीं करता — चाहे 500 ई.पू. हो या 700 ई., इसके नियम आज भी प्रभावी और सत्यापनीय हैं।</>
            : <>Scholars debate BPHS&apos;s authorship date. Tradition credits Maharishi Parashara (father of Veda Vyasa), placing it in deep antiquity. Modern research suggests the current version is a 7th-8th century CE compilation gathering older oral traditions. This debate does not diminish the text&apos;s value — whether 500 BCE or 700 CE, its rules remain effective and verifiable in chart analysis today.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module30_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

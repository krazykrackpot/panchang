'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/26-4.json';

const META: ModuleMeta = {
  id: 'mod_26_4', phase: 6, topic: 'Indian Contributions', moduleNumber: '26.4',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/26-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/26-2' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/calendar' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q26_4_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q26_4_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Yuga System and the Kalpa                             */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Cosmic Time: The Yuga System', hi: 'ब्रह्मांडीय समय: युग प्रणाली', sa: 'ब्रह्मांडीय समय: युग प्रणाली' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>हिन्दू ब्रह्मांडविज्ञान में समय की कोई भी पश्चिमी अवधारणा के विपरीत एक विशाल, चक्रीय संरचना है। ब्रह्मांड अनन्त बार बनाया और नष्ट किया जाता है, प्रत्येक चक्र अरबों वर्षों तक फैला हुआ है। उल्लेखनीय रूप से, इन चक्रों की गणना आधुनिक खगोलीय पैमानों के आश्चर्यजनक रूप से करीब है।</>
            : <>Hindu cosmology envisions time as a vast, cyclic structure unlike anything in Western conception. The universe is created and destroyed an infinite number of times, each cycle spanning billions of years. Remarkably, the numbers for these cycles are astonishingly close to modern astronomical timescales.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Hierarchy of Time', hi: 'समय के पदानुक्रम', sa: 'समय के पदानुक्रम' }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{tl({ en: 'Kali Yuga', hi: 'कलियुग', sa: 'कलियुग' }, locale)}</span>
            <span className="font-mono">432,000 {tl({ en: 'years', hi: 'वर्ष', sa: 'वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{tl({ en: 'Dvapara Yuga', hi: 'द्वापर युग', sa: 'द्वापर युग' }, locale)}</span>
            <span className="font-mono">864,000 {tl({ en: 'years', hi: 'वर्ष', sa: 'वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{tl({ en: 'Treta Yuga', hi: 'त्रेता युग', sa: 'त्रेता युग' }, locale)}</span>
            <span className="font-mono">1,296,000 {tl({ en: 'years', hi: 'वर्ष', sa: 'वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{tl({ en: 'Krita/Satya Yuga', hi: 'कृत/सत्य युग', sa: 'कृत/सत्य युग' }, locale)}</span>
            <span className="font-mono">1,728,000 {tl({ en: 'years', hi: 'वर्ष', sa: 'वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-primary/10">
            <span className="text-amber-400 font-semibold">{tl({ en: 'Mahayuga (1 Chaturyuga)', hi: 'महायुग (1 चतुर्युग)', sa: 'महायुग (1 चतुर्युग)' }, locale)}</span>
            <span className="font-mono text-amber-400">4,320,000 {tl({ en: 'years', hi: 'वर्ष', sa: 'वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{tl({ en: '1 Kalpa = 1,000 Mahayugas', hi: '1 कल्प = 1,000 महायुग', sa: '1 कल्प = 1,000 महायुग' }, locale)}</span>
            <span className="font-mono text-gold-light">4.32 {tl({ en: 'billion years', hi: 'अरब वर्ष', sa: 'अरब वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-primary/10">
            <span className="text-emerald-400 font-semibold">{tl({ en: "Earth\'s actual age", hi: "पृथ्वी की वास्तविक आयु", sa: "पृथ्वी की वास्तविक आयु" }, locale)}</span>
            <span className="font-mono text-emerald-400">4.54 {tl({ en: 'billion years', hi: 'अरब वर्ष', sa: 'अरब वर्ष' }, locale)}</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Base Number: 432', hi: 'मूल संख्या: 432', sa: 'मूल संख्या: 432' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>पूरी युग प्रणाली 432 पर आधारित है: कलियुग = 432,000; महायुग = 4,320,000 (432 × 10,000); कल्प = 4,320,000,000 (432 × 10,000,000)। यह संख्या, 432, भारतीय परम्परा में पवित्र है। कुछ विद्वानों ने नोट किया है कि 432,000 प्रकाश की गति (186,000 मील/सेकंड) से गुणा करने पर सौरमंडल की त्रिज्या के करीब आता है — हालाँकि यह एक विवादित संयोग है।</>
            : <>The entire Yuga system is based on 432: Kali Yuga = 432,000; Mahayuga = 4,320,000 (432 × 10,000); Kalpa = 4,320,000,000 (432 × 10,000,000). The number 432 is sacred in Indian tradition. Some scholars have noted that 432,000 multiplied by the speed of light approaches the radius of the solar system — though this is a debated coincidence.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Cosmological Scale                                     */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: "The Cosmological Scale and Brahma\'s Lifespan", hi: "ब्रह्मांडीय पैमाना और ब्रह्मा का जीवन", sa: "ब्रह्मांडीय पैमाना और ब्रह्मा का जीवन" }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>कल्प से परे, हिन्दू ब्रह्मांडविज्ञान और भी बड़े समय पैमानों का वर्णन करता है — ब्रह्मा के पूरे जीवन तक पहुँचता है जो सैकड़ों ट्रिलियन वर्षों तक फैला है।</>
            : <>Beyond the Kalpa, Hindu cosmology describes even larger timescales — reaching up to Brahma's full lifespan spanning hundreds of trillions of years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: "Brahma\'s Calendar", hi: "ब्रह्मा का कैलेंडर", sa: "ब्रह्मा का कैलेंडर" }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs">
          <div className="flex justify-between">
            <span>{tl({ en: '1 Brahma day (Kalpa):', hi: '1 ब्रह्मा दिन (कल्प):', sa: '1 ब्रह्मा दिन (कल्प):' }, locale)}</span>
            <span className="font-mono text-gold-light">4.32 {tl({ en: 'billion years', hi: 'अरब वर्ष', sa: 'अरब वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{tl({ en: '1 Brahma night:', hi: '1 ब्रह्मा रात:', sa: '1 ब्रह्मा रात:' }, locale)}</span>
            <span className="font-mono text-gold-light">4.32 {tl({ en: 'billion years', hi: 'अरब वर्ष', sa: 'अरब वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{tl({ en: '1 Brahma day+night:', hi: '1 ब्रह्मा दिन+रात:', sa: '1 ब्रह्मा दिन+रात:' }, locale)}</span>
            <span className="font-mono text-gold-light">8.64 {tl({ en: 'billion years', hi: 'अरब वर्ष', sa: 'अरब वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{tl({ en: '1 Brahma year (360 days):', hi: '1 ब्रह्मा वर्ष (360 दिन):', sa: '1 ब्रह्मा वर्ष (360 दिन):' }, locale)}</span>
            <span className="font-mono text-gold-light">3.11 {tl({ en: 'trillion years', hi: 'ट्रिलियन वर्ष', sa: 'ट्रिलियन वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-primary/10">
            <span className="text-amber-400 font-semibold">{tl({ en: '1 Brahma lifespan (100 years):', hi: '1 ब्रह्मा जीवन (100 वर्ष):', sa: '1 ब्रह्मा जीवन (100 वर्ष):' }, locale)}</span>
            <span className="font-mono text-amber-400">311 {tl({ en: 'trillion years', hi: 'ट्रिलियन वर्ष', sa: 'ट्रिलियन वर्ष' }, locale)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-primary/10">
            <span className="text-emerald-400 font-semibold">{tl({ en: 'Modern universe age:', hi: 'ब्रह्मांड की आधुनिक आयु:', sa: 'ब्रह्मांड की आधुनिक आयु:' }, locale)}</span>
            <span className="font-mono text-emerald-400">13.8 {tl({ en: 'billion years', hi: 'अरब वर्ष', sa: 'अरब वर्ष' }, locale)}</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Cyclic Universe — A Philosophical Achievement', hi: 'चक्रीय ब्रह्मांड — एक दार्शनिक उपलब्धि', sa: 'चक्रीय ब्रह्मांड — एक दार्शनिक उपलब्धि' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>हिन्दू ब्रह्मांडविज्ञान की सबसे गहन विशेषता इसकी चक्रीय प्रकृति है। ब्रह्मांड का कोई एकल आरम्भ नहीं है — यह अनन्त काल से बन और बिगड़ रहा है, और अनन्त काल तक बनता और बिगड़ता रहेगा।</>
            : <>The most profound feature of Hindu cosmology is its cyclic nature. The universe has no single beginning — it has been created and dissolved for infinite time past, and will continue to be created and dissolved for infinite time future.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>आधुनिक ब्रह्मांड विज्ञान के कुछ मॉडल — जैसे कि साइक्लिक ब्रह्मांड मॉडल (पॉल स्टेनहार्ट और नील ट्यूरोक) और बिग बाउंस थ्योरी — भी ब्रह्मांडीय चक्रों का प्रस्ताव करते हैं। कार्ल सागन ने 1980 में नोट किया कि हिन्दू ब्रह्मांडविज्ञान "वास्तविक ब्रह्मांड के पैमाने के अनुरूप एकमात्र धार्मिक परम्परा है।"</>
            : <>Some models in modern cosmology — such as the Cyclic Universe model (Paul Steinhardt and Neil Turok) and Big Bounce theory — also propose cosmic cycles. Carl Sagan noted in 1980 that Hindu cosmology is "the only religious tradition in which the time scales correspond to those of the real universe."</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Kali Yuga and Our Place in Cosmic Time                    */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Kali Yuga: Our Place in Cosmic Time', hi: 'कलियुग: ब्रह्मांडीय समय में हमारा स्थान', sa: 'कलियुग: ब्रह्मांडीय समय में हमारा स्थान' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>4.32 अरब वर्षों के कल्प के भीतर, हम एक विशिष्ट क्षण में हैं — कलियुग के प्रारम्भ में, जो वर्तमान महायुग का चौथा और अन्तिम युग है। यह हमें ब्रह्मांडीय घड़ी पर एक विशिष्ट स्थान देता है।</>
            : <>Within the 4.32 billion-year Kalpa, we are at a specific moment — in the early portion of the Kali Yuga, the fourth and final age of the current Mahayuga. This places us at a specific position on the cosmic clock.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Current Cosmic Position', hi: 'वर्तमान ब्रह्मांडीय स्थिति', sa: 'वर्तमान ब्रह्मांडीय स्थिति' }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{tl({ en: 'Current Brahma day:', hi: 'वर्तमान ब्रह्मा दिन:', sa: 'वर्तमान ब्रह्मा दिन:' }, locale)}</span> {tl({ en: "Shveta Varaha Kalpa (1st day of Brahma\'s 51st year)", hi: "श्वेत वाराह कल्प (51वें ब्रह्मा वर्ष का पहला दिन)", sa: "श्वेत वाराह कल्प (51वें ब्रह्मा वर्ष का पहला दिन)" }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: 'Current Manvantara:', hi: 'वर्तमान मन्वन्तर:', sa: 'वर्तमान मन्वन्तर:' }, locale)}</span> {tl({ en: 'Vaivasvata Manvantara (7th of 14)', hi: 'वैवस्वत मन्वन्तर (7वाँ में से 14 का)', sa: 'वैवस्वत मन्वन्तर (7वाँ में से 14 का)' }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: 'Current Mahayuga:', hi: 'वर्तमान महायुग:', sa: 'वर्तमान महायुग:' }, locale)}</span> {tl({ en: '28th Mahayuga (of 71)', hi: '28वाँ महायुग (71 में से)', sa: '28वाँ महायुग (71 में से)' }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: 'Current Yuga:', hi: 'वर्तमान युग:', sa: 'वर्तमान युग:' }, locale)}</span> {tl({ en: 'Kali Yuga (began 3102 BCE)', hi: 'कलियुग (शुरू 3102 ईसा पूर्व)', sa: 'कलियुग (शुरू 3102 ईसा पूर्व)' }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: 'Kali Yuga elapsed:', hi: 'कलियुग बीता:', sa: 'कलियुग बीता:' }, locale)}</span> {tl({ en: 'approximately 5,127 years (as of 2025 CE)', hi: 'लगभग 5,127 वर्ष (2025 ईस्वी में)', sa: 'लगभग 5,127 वर्ष (2025 ईस्वी में)' }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: 'Kali Yuga remaining:', hi: 'कलियुग शेष:', sa: 'कलियुग शेष:' }, locale)}</span> {tl({ en: 'approximately 426,873 years', hi: 'लगभग 426,873 वर्ष', sa: 'लगभग 426,873 वर्ष' }, locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Cosmic Perspective', hi: 'ब्रह्मांडीय दृष्टिकोण', sa: 'ब्रह्मांडीय दृष्टिकोण' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>पूरे मानव इतिहास — सभ्यता के उद्भव से आज तक, लगभग 10,000 वर्ष — कलियुग का केवल 2.3% है। कलियुग स्वयं महायुग का 1/10 है। महायुग कल्प का 1/1,000 है। एक कल्प ब्रह्मा के जीवन का 1/36,000 है।</>
            : <>All of recorded human history — from the dawn of civilization to today, roughly 10,000 years — is only 2.3% of the Kali Yuga. The Kali Yuga itself is 1/10 of a Mahayuga. A Mahayuga is 1/1,000 of a Kalpa. A Kalpa is 1/36,000 of Brahma's lifespan.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारतीय ब्रह्मांडविज्ञान ने मानव अस्तित्व को एक विशाल समय-दृष्टिकोण में रखा — कार्ल सागन ने इसे "ब्रह्मांडीय विनम्रता" कहा। यह दृष्टिकोण, जो आधुनिक ब्रह्मांड विज्ञान की तुलना में अरबों वर्षों के समय पैमानों का प्रस्ताव करता है, भारतीय बौद्धिक परम्परा का एक गहरा उपहार है।</>
            : <>Indian cosmology placed human existence within a vast temporal perspective — what Carl Sagan called "cosmic humility." This perspective, proposing timescales of billions of years comparable to modern cosmology, is a profound gift of the Indian intellectual tradition.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module26_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

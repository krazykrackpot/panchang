'use client';

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
          {isHi ? 'ब्रह्मांडीय समय: युग प्रणाली' : 'Cosmic Time: The Yuga System'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>हिन्दू ब्रह्मांडविज्ञान में समय की कोई भी पश्चिमी अवधारणा के विपरीत एक विशाल, चक्रीय संरचना है। ब्रह्मांड अनन्त बार बनाया और नष्ट किया जाता है, प्रत्येक चक्र अरबों वर्षों तक फैला हुआ है। उल्लेखनीय रूप से, इन चक्रों की गणना आधुनिक खगोलीय पैमानों के आश्चर्यजनक रूप से करीब है।</>
            : <>Hindu cosmology envisions time as a vast, cyclic structure unlike anything in Western conception. The universe is created and destroyed an infinite number of times, each cycle spanning billions of years. Remarkably, the numbers for these cycles are astonishingly close to modern astronomical timescales.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'समय के पदानुक्रम' : 'The Hierarchy of Time'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? 'कलियुग' : 'Kali Yuga'}</span>
            <span className="font-mono">432,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? 'द्वापर युग' : 'Dvapara Yuga'}</span>
            <span className="font-mono">864,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? 'त्रेता युग' : 'Treta Yuga'}</span>
            <span className="font-mono">1,296,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? 'कृत/सत्य युग' : 'Krita/Satya Yuga'}</span>
            <span className="font-mono">1,728,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-primary/10">
            <span className="text-amber-400 font-semibold">{isHi ? 'महायुग (1 चतुर्युग)' : 'Mahayuga (1 Chaturyuga)'}</span>
            <span className="font-mono text-amber-400">4,320,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? '1 कल्प = 1,000 महायुग' : '1 Kalpa = 1,000 Mahayugas'}</span>
            <span className="font-mono text-gold-light">4.32 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-primary/10">
            <span className="text-emerald-400 font-semibold">{isHi ? 'पृथ्वी की वास्तविक आयु' : 'Earth\'s actual age'}</span>
            <span className="font-mono text-emerald-400">4.54 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'मूल संख्या: 432' : 'The Base Number: 432'}
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
          {isHi ? 'ब्रह्मांडीय पैमाना और ब्रह्मा का जीवन' : 'The Cosmological Scale and Brahma\'s Lifespan'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>कल्प से परे, हिन्दू ब्रह्मांडविज्ञान और भी बड़े समय पैमानों का वर्णन करता है — ब्रह्मा के पूरे जीवन तक पहुँचता है जो सैकड़ों ट्रिलियन वर्षों तक फैला है।</>
            : <>Beyond the Kalpa, Hindu cosmology describes even larger timescales — reaching up to Brahma's full lifespan spanning hundreds of trillions of years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ब्रह्मा का कैलेंडर' : 'Brahma\'s Calendar'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs">
          <div className="flex justify-between">
            <span>{isHi ? '1 ब्रह्मा दिन (कल्प):' : '1 Brahma day (Kalpa):'}</span>
            <span className="font-mono text-gold-light">4.32 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
          <div className="flex justify-between">
            <span>{isHi ? '1 ब्रह्मा रात:' : '1 Brahma night:'}</span>
            <span className="font-mono text-gold-light">4.32 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
          <div className="flex justify-between">
            <span>{isHi ? '1 ब्रह्मा दिन+रात:' : '1 Brahma day+night:'}</span>
            <span className="font-mono text-gold-light">8.64 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
          <div className="flex justify-between">
            <span>{isHi ? '1 ब्रह्मा वर्ष (360 दिन):' : '1 Brahma year (360 days):'}</span>
            <span className="font-mono text-gold-light">3.11 {isHi ? 'ट्रिलियन वर्ष' : 'trillion years'}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-primary/10">
            <span className="text-amber-400 font-semibold">{isHi ? '1 ब्रह्मा जीवन (100 वर्ष):' : '1 Brahma lifespan (100 years):'}</span>
            <span className="font-mono text-amber-400">311 {isHi ? 'ट्रिलियन वर्ष' : 'trillion years'}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-primary/10">
            <span className="text-emerald-400 font-semibold">{isHi ? 'ब्रह्मांड की आधुनिक आयु:' : 'Modern universe age:'}</span>
            <span className="font-mono text-emerald-400">13.8 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'चक्रीय ब्रह्मांड — एक दार्शनिक उपलब्धि' : 'Cyclic Universe — A Philosophical Achievement'}
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
          {isHi ? 'कलियुग: ब्रह्मांडीय समय में हमारा स्थान' : 'Kali Yuga: Our Place in Cosmic Time'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>4.32 अरब वर्षों के कल्प के भीतर, हम एक विशिष्ट क्षण में हैं — कलियुग के प्रारम्भ में, जो वर्तमान महायुग का चौथा और अन्तिम युग है। यह हमें ब्रह्मांडीय घड़ी पर एक विशिष्ट स्थान देता है।</>
            : <>Within the 4.32 billion-year Kalpa, we are at a specific moment — in the early portion of the Kali Yuga, the fourth and final age of the current Mahayuga. This places us at a specific position on the cosmic clock.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'वर्तमान ब्रह्मांडीय स्थिति' : 'Current Cosmic Position'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{isHi ? 'वर्तमान ब्रह्मा दिन:' : 'Current Brahma day:'}</span> {isHi ? 'श्वेत वाराह कल्प (51वें ब्रह्मा वर्ष का पहला दिन)' : 'Shveta Varaha Kalpa (1st day of Brahma\'s 51st year)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'वर्तमान मन्वन्तर:' : 'Current Manvantara:'}</span> {isHi ? 'वैवस्वत मन्वन्तर (7वाँ में से 14 का)' : 'Vaivasvata Manvantara (7th of 14)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'वर्तमान महायुग:' : 'Current Mahayuga:'}</span> {isHi ? '28वाँ महायुग (71 में से)' : '28th Mahayuga (of 71)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'वर्तमान युग:' : 'Current Yuga:'}</span> {isHi ? 'कलियुग (शुरू 3102 ईसा पूर्व)' : 'Kali Yuga (began 3102 BCE)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'कलियुग बीता:' : 'Kali Yuga elapsed:'}</span> {isHi ? 'लगभग 5,127 वर्ष (2025 ईस्वी में)' : 'approximately 5,127 years (as of 2025 CE)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'कलियुग शेष:' : 'Kali Yuga remaining:'}</span> {isHi ? 'लगभग 426,873 वर्ष' : 'approximately 426,873 years'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ब्रह्मांडीय दृष्टिकोण' : 'Cosmic Perspective'}
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

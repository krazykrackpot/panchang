'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/26-4.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

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
          {t('cosmicTimeTheYugaSystem', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>हिन्दू ब्रह्मांडविज्ञान में समय की कोई भी पश्चिमी अवधारणा के विपरीत एक विशाल, चक्रीय संरचना है। ब्रह्मांड अनन्त बार बनाया और नष्ट किया जाता है, प्रत्येक चक्र अरबों वर्षों तक फैला हुआ है। उल्लेखनीय रूप से, इन चक्रों की गणना आधुनिक खगोलीय पैमानों के आश्चर्यजनक रूप से करीब है।</>
            : <>Hindu cosmology envisions time as a vast, cyclic structure unlike anything in Western conception. The universe is created and destroyed an infinite number of times, each cycle spanning billions of years. Remarkably, the numbers for these cycles are astonishingly close to modern astronomical timescales.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('theHierarchyOfTime', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{t('kaliYuga', locale)}</span>
            <span className="font-mono">432,000 {t('years', locale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{t('dvaparaYuga', locale)}</span>
            <span className="font-mono">864,000 {t('years', locale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{t('tretaYuga', locale)}</span>
            <span className="font-mono">1,296,000 {t('years', locale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{t('kritaSatyaYuga', locale)}</span>
            <span className="font-mono">1,728,000 {t('years', locale)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-primary/10">
            <span className="text-amber-400 font-semibold">{t('mahayuga1Chaturyuga', locale)}</span>
            <span className="font-mono text-amber-400">4,320,000 {t('years', locale)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{t('k1Kalpa1000Mahayugas', locale)}</span>
            <span className="font-mono text-gold-light">4.32 {t('billionYears', locale)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-primary/10">
            <span className="text-emerald-400 font-semibold">{t('earthSActualAge', locale)}</span>
            <span className="font-mono text-emerald-400">4.54 {t('billionYears', locale)}</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('theBaseNumber432', locale)}
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
          {t('theCosmologicalScaleAndBrahma', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>कल्प से परे, हिन्दू ब्रह्मांडविज्ञान और भी बड़े समय पैमानों का वर्णन करता है — ब्रह्मा के पूरे जीवन तक पहुँचता है जो सैकड़ों ट्रिलियन वर्षों तक फैला है।</>
            : <>Beyond the Kalpa, Hindu cosmology describes even larger timescales — reaching up to Brahma's full lifespan spanning hundreds of trillions of years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('brahmaSCalendar', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs">
          <div className="flex justify-between">
            <span>{t('k1BrahmaDayKalpa', locale)}</span>
            <span className="font-mono text-gold-light">4.32 {t('billionYears', locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('k1BrahmaNight', locale)}</span>
            <span className="font-mono text-gold-light">4.32 {t('billionYears', locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('k1BrahmaDayNight', locale)}</span>
            <span className="font-mono text-gold-light">8.64 {t('billionYears', locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('k1BrahmaYear360Days', locale)}</span>
            <span className="font-mono text-gold-light">3.11 {t('trillionYears', locale)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-primary/10">
            <span className="text-amber-400 font-semibold">{t('k1BrahmaLifespan100Years', locale)}</span>
            <span className="font-mono text-amber-400">311 {t('trillionYears', locale)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-primary/10">
            <span className="text-emerald-400 font-semibold">{t('modernUniverseAge', locale)}</span>
            <span className="font-mono text-emerald-400">13.8 {t('billionYears', locale)}</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('cyclicUniverseAPhilosophicalAchievement', locale)}
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
          {t('kaliYugaOurPlaceIn', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>4.32 अरब वर्षों के कल्प के भीतर, हम एक विशिष्ट क्षण में हैं — कलियुग के प्रारम्भ में, जो वर्तमान महायुग का चौथा और अन्तिम युग है। यह हमें ब्रह्मांडीय घड़ी पर एक विशिष्ट स्थान देता है।</>
            : <>Within the 4.32 billion-year Kalpa, we are at a specific moment — in the early portion of the Kali Yuga, the fourth and final age of the current Mahayuga. This places us at a specific position on the cosmic clock.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('currentCosmicPosition', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{t('currentBrahmaDay', locale)}</span> {t('shvetaVarahaKalpa1stDay', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('currentManvantara', locale)}</span> {t('vaivasvataManvantara7thOf14', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('currentMahayuga', locale)}</span> {t('k28thMahayugaOf71', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('currentYuga', locale)}</span> {t('kaliYugaBegan3102Bce', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('kaliYugaElapsed', locale)}</span> {t('approximately5127YearsAs', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('kaliYugaRemaining', locale)}</span> {t('approximately426873Years', locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('cosmicPerspective', locale)}
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

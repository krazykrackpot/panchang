'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/13-4.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_13_4', phase: 3, topic: 'Transits', moduleNumber: '13.4',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs.map(cr => ({ label: cr.label as unknown as Record<string, string>, href: cr.href })),
};

const QUESTIONS = (L.questions as unknown) as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whyEclipsesHappen', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>समुद्र मन्थन की पौराणिक कथा में, स्वर्भानु नामक असुर ने देवताओं के रूप में अमृत पी लिया। सूर्य और चन्द्रमा ने उसे पहचान लिया और विष्णु ने सुदर्शन चक्र से उसका सिर धड़ से अलग कर दिया। शिर राहु बना — आरोही चन्द्र पात; धड़ केतु बना — अवरोही चन्द्र पात। तब से, राहु और केतु आकाश में चक्कर लगाते हैं और समय-समय पर सूर्य व चन्द्रमा को निगल लेते हैं — और ग्रहण होता है। पौराणिक कथा जो बताती है वह खगोलीय सत्य है: ग्रहण ठीक वहाँ होते हैं जहाँ राहु और केतु हैं।</> : <>In the myth of the Samudra Manthan (Ocean Churning), a demon named Svarbhanu disguised himself as a god and drank the nectar of immortality. The Sun and Moon recognised him; Vishnu severed his head with the Sudarshana Chakra. The head became Rahu — the ascending lunar node; the torso became Ketu — the descending lunar node. Ever since, Rahu and Ketu circle the sky, periodically swallowing the Sun and Moon — and an eclipse occurs. What the myth encodes is astronomical fact: eclipses happen precisely where Rahu and Ketu are.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{t('theAstronomicalMechanism', locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">चन्द्रमा का झुकाव:</span> चन्द्रमा की कक्षीय तल क्रान्तिवृत्त (सूर्य का प्रत्यक्ष मार्ग) के सापेक्ष 5.15° झुकी है। अधिकतर समय चन्द्रमा सूर्य की छाया के ऊपर या नीचे से गुज़रता है।</> : <><span className="text-gold-light font-medium">The Moon&apos;s tilt:</span> The Moon&apos;s orbital plane is tilted 5.15° relative to the ecliptic (the Sun&apos;s apparent path). Most of the time the Moon passes above or below the Sun&apos;s shadow.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">पात बिन्दु:</span> चन्द्रमा महीने में दो बार क्रान्तिवृत्त तल पार करता है। इन बिन्दुओं को चन्द्र पात कहते हैं — उत्तर की ओर जाते समय आरोही पात (राहु), दक्षिण की ओर अवरोही पात (केतु)। यहाँ चन्द्रमा का अक्षांश शून्य है।</> : <><span className="text-gold-light font-medium">The nodal points:</span> The Moon crosses the ecliptic plane twice a month. These crossing points are the lunar nodes — ascending (Rahu) when moving north, descending (Ketu) when moving south. Here the Moon&apos;s ecliptic latitude is zero.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">सूर्य ग्रहण की शर्त:</span> अमावस्या + पात के निकट = सूर्य ग्रहण। चन्द्रमा पृथ्वी और सूर्य के बीच आता है; चन्द्रमा की छाया पृथ्वी की सतह पर पड़ती है।</> : <><span className="text-gold-light font-medium">Solar eclipse condition:</span> New Moon + near a node = solar eclipse. The Moon passes between Earth and Sun; the Moon&apos;s shadow falls on Earth&apos;s surface.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">चन्द्र ग्रहण की शर्त:</span> पूर्णिमा + पात के निकट = चन्द्र ग्रहण। पृथ्वी सूर्य और चन्द्रमा के बीच आती है; चन्द्रमा पृथ्वी की छाया में प्रवेश करता है।</> : <><span className="text-gold-light font-medium">Lunar eclipse condition:</span> Full Moon + near a node = lunar eclipse. Earth passes between Sun and Moon; the Moon enters Earth&apos;s shadow.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{t('eclipseSeasons', locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>प्रत्येक अमावस्या और पूर्णिमा ग्रहण नहीं होती — केवल लगभग 2–3 ग्रहण ऋतुएँ प्रति वर्ष होती हैं। प्रत्येक ऋतु लगभग 34–38 दिन लम्बी होती है, जब सूर्य किसी पात के 15–18° के भीतर होता है। एक ऋतु में 2–3 ग्रहण हो सकते हैं: एक सूर्य और एक चन्द्र, या दो सूर्य और एक चन्द्र। यही कारण है कि ग्रहण समूहों में आते हैं।</> : <>Not every New Moon and Full Moon is an eclipse — there are only about 2–3 eclipse seasons per year. Each season lasts about 34–38 days, when the Sun is within 15–18° of a node. A single season may produce 2–3 eclipses: one solar and one lunar, or two solar and one lunar. This is why eclipses tend to come in clusters.</>}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Types, Phases & Our Calculation                           */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('typesPhasesOurCalculation', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण 6 प्रकार के होते हैं, जो सूर्य ग्रहण की तीन और चन्द्र ग्रहण की तीन श्रेणियों में विभाजित हैं। प्रत्येक प्रकार चन्द्रमा की पृथ्वी से दूरी, उसके सटीक क्रान्तिक अक्षांश और पर्यवेक्षक की स्थिति पर निर्भर करता है। हमारी ग्रहण गणना का इंजन मेयस एल्गोरिदम और स्विस एफेमेरिस डेटा का उपयोग करके इन मापदण्डों की गणना करता है।</> : <>Eclipses come in 6 types, divided into three solar categories and three lunar categories. Each type depends on the Moon&apos;s distance from Earth, its precise ecliptic latitude, and the observer&apos;s location. Our eclipse calculation engine computes these parameters using Meeus algorithms and Swiss Ephemeris data.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{t('k6TypesOfEclipse', locale)}</h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('totalSolar', locale)}</span>{' '}
            {t('moonFullyCoversTheSun', locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('annularSolar', locale)}</span>{' '}
            {t('moonNearApogeeAppearsSmaller', locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('partialSolar', locale)}</span>{' '}
            {t('moonCoversOnlyPartOf', locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('totalLunarBloodMoon', locale)}</span>{' '}
            {t('moonFullyWithinEarthS', locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('partialLunar', locale)}</span>{' '}
            {t('partOfTheMoonEnters', locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('penumbralLunar', locale)}</span>{' '}
            {t('moonPassesOnlyThroughEarth', locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{t('eclipsePhases', locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">सूर्य ग्रहण:</span> स्पर्श (C1) — बाह्य संपर्क आरम्भ। मध्य — अधिकतम ग्रहण। मोक्ष (C4) — बाह्य संपर्क समाप्त। पूर्ण/कंकणाकृति ग्रहण में: C2 — आन्तरिक संपर्क आरम्भ (पूर्णता आरम्भ); C3 — आन्तरिक संपर्क समाप्त (पूर्णता समाप्त)।</> : <><span className="text-gold-light font-medium">Solar eclipse:</span> Sparsha (C1) — first external contact. Madhya — maximum eclipse. Moksha (C4) — last external contact. For total/annular: C2 — second contact (totality begins); C3 — third contact (totality ends).</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">चन्द्र ग्रहण:</span> P1 — उपछाया में प्रवेश। U1 — छाया में प्रवेश (आंशिक आरम्भ)। अधिकतम — गहरतम। U2 — छाया से बाहर (आंशिक समाप्त)। P4 — उपछाया से बाहर।</> : <><span className="text-gold-light font-medium">Lunar eclipse:</span> P1 — penumbral entry. U1 — umbral entry (partial begins). Maximum — deepest point. U2 — umbral exit (partial ends). P4 — penumbral exit.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{t('howWeCalculate', locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">{t('step1', locale)}</span>{' '}
          {t('findAllAmavasyaPurnimaFrom', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">{t('step2', locale)}</span>{' '}
          {t('getMoonSEclipticLatitude', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">{t('step3', locale)}</span>{' '}
          {t('applyDistanceScaledThresholdΒ', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">{t('step4', locale)}</span>{' '}
          {t('computeLocalContactTimesUsing', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">{t('step5', locale)}</span>{' '}
          {t('computeMagnitudeForSolarFraction', locale)}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Sutak, Kundali Impact & Saros                             */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('sutakKundaliImpactSaros', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण केवल खगोलीय घटनाएँ नहीं — ये शक्तिशाली ऊर्जा परिवर्तन हैं। जिस समय पृथ्वी, चन्द्रमा और सूर्य सटीक संरेखण में होते हैं, वह समय असाधारण माना जाता है। परम्परागत पञ्चाङ्ग सूतक नियम (ग्रहण पूर्व अशुचि काल) और ग्रहण के दौरान पालनीय आचार निर्धारित करते हैं। ज्योतिष में, ग्रहण जन्मकालीन ग्रहों को सक्रिय करते हैं।</> : <>Eclipses are not merely astronomical events — they are powerful energy shifts. The moment Earth, Moon, and Sun align with mathematical precision is considered extraordinary. Traditional Panchang texts prescribe Sutak rules (pre-eclipse impurity periods) and observances during the eclipse. In Jyotish, eclipses act as powerful activators of natal planets.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{t('sutakRulesThreeTraditions', locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{t('dharmasindhu', locale)}</span>{' '}
          {t('solarEclipse12Hours4', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{t('nirnayaSindhu', locale)}</span>{' '}
          {t('solarEclipse12HoursBefore', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{t('muhurtaChintamani', locale)}</span>{' '}
          {t('solarEclipse3Praharas9', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3 pt-3 border-t border-gold-primary/10">
          <span className="text-gold-light font-medium">{t('whatToDoAvoidDuring', locale)}</span>
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-1">{isHi ? <>परिहार करें: भोजन पकाना और खाना (दही, पका भोजन), नया कार्य आरम्भ, मैथुन, सोना। अनुशंसित: मन्त्र जप, ध्यान, दान, पवित्र नदी स्नान (ग्रहण स्नान), भगवत् स्मरण। ग्रहण समाप्ति के बाद: स्नान, ताज़ा भोजन पकाना।</> : <>Avoid: cooking and eating food (curd, cooked food), starting new ventures, sexual activity, sleeping. Recommended: mantra japa, meditation, charity, holy river bathing (Grahan Snan), devotional remembrance. After eclipse ends: bath, cook fresh food.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{t('eclipseImpactOnTheNatal', locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{t('eclipseOnNatalPlanets', locale)}</span>{' '}
          {t('whenAnEclipseFallsOn', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{t('eclipseInASpecificHouse', locale)}</span>{' '}
          {t('eclipseInAHouseActivates', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">{t('timeline', locale)}</span>{' '}
          {t('eclipseEffectsAreNotAlways', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{t('theSarosCycle', locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>सारोस चक्र लगभग 18 वर्ष, 11 दिन और 8 घण्टे का होता है। इस अवधि के बाद, सूर्य, चन्द्रमा और पृथ्वी लगभग उसी ज्यामितीय स्थिति में लौटते हैं — फलतः बहुत समान प्रकार, अवधि और परिमाण का ग्रहण होता है। &ldquo;लगभग&rdquo; इसलिए कि अतिरिक्त 8 घण्टे के कारण पृथ्वी लगभग 120° और घूम जाती है, इसलिए दोहराने वाला ग्रहण पिछले वाले से 120° पश्चिम में होता है।</> : <>The Saros cycle is approximately 18 years, 11 days, and 8 hours. After this period, the Sun, Moon, and Earth return to nearly the same geometric configuration — producing an eclipse of very similar type, duration, and magnitude. &ldquo;Nearly&rdquo; because the extra 8 hours means Earth has rotated about 120° further, so the repeat eclipse occurs 120° west of the previous one.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>तीन सारोस चक्रों को मिलाकर एक &ldquo;एक्सेलिग्मोस&rdquo; (~54 वर्ष, 33 दिन) बनता है, जो ग्रहण को लगभग उसी देशान्तर पर वापस लाता है। प्राचीन बाबुलियों ने इस चक्र की खोज की थी। कल्डीय पुरोहित भविष्यवाणी करते थे कि अगला ग्रहण कब होगा — हजारों वर्ष पहले, बिना किसी आधुनिक दूरदर्शी के।</> : <>Three Saros cycles combine to form an &ldquo;Exeligmos&rdquo; (~54 years, 33 days) that brings an eclipse back to nearly the same longitude. The ancient Babylonians discovered this cycle. Chaldean priests could predict when the next eclipse would occur — thousands of years ago, without any modern telescope.</>}</p>
      </section>
    </div>
  );
}

export default function Module13_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


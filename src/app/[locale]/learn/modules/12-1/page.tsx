'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/12-1.json';

const META: ModuleMeta = {
  id: 'mod_12_1', phase: 3, topic: 'Transits', moduleNumber: '12.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
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
          {tl({ en: 'What Are Transits?', hi: 'गोचर क्या है?', sa: 'गोचर क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>गोचर का अर्थ है ग्रहों की वर्तमान, वास्तविक समय की स्थिति जो राशिचक्र में गतिमान रहती है और जन्म कुण्डली पर आरोपित होती है। जन्म कुण्डली जन्म क्षण के आकाश का स्थिर चित्र है, जबकि गोचर निरन्तर बदलता आकाशीय वातावरण है जो आपकी कुण्डली के विभिन्न भागों को विभिन्न समय पर सक्रिय करता है। जन्मकालिक और गोचरी ग्रहों की परस्पर क्रिया वैदिक फलित ज्योतिष का प्रमुख यन्त्र है।</> : <>Transits (Gochar) refer to the current, real-time positions of planets as they move through the zodiac, overlaid on your natal birth chart. While the birth chart is a frozen snapshot of the sky at the moment of birth, transits represent the ever-changing celestial weather that activates different parts of your chart at different times. The interaction between natal positions and transiting planets is the primary engine of Vedic predictive astrology.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Slow Planets — Major Life Themes', hi: 'मन्द ग्रह — प्रमुख जीवन विषय', sa: 'मन्द ग्रह — प्रमुख जीवन विषय' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>मन्द ग्रह आपकी जीवन कथा के व्यापक अध्याय निर्धारित करते हैं। शनि प्रत्येक राशि में लगभग 2.5 वर्ष रहता है, जिस भाव में गोचर करता है वहाँ अनुशासन, पुनर्गठन और कर्म-हिसाब का दीर्घकाल बनाता है। गुरु लगभग 13 मास में एक राशि से गुजरता है, विस्तार, अवसर और ज्ञान लाता है। राहु और केतु प्रत्येक राशि में लगभग 18 मास रहते हैं, गहन इच्छाओं और कार्मिक मुक्ति को जगाते हैं।</> : <>The slow-moving planets define the broad chapters of your life story. Saturn spends approximately 2.5 years in each sign, creating extended periods of discipline, restructuring, and karmic reckoning in the house it transits. Jupiter moves through a sign in about 13 months, bringing expansion, opportunity, and wisdom. Rahu and Ketu (the lunar nodes) transit each sign for roughly 18 months, stirring deep desires and karmic release.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Fast Planets — Event Triggers', hi: 'तीव्र ग्रह — घटना प्रेरक', sa: 'तीव्र ग्रह — घटना प्रेरक' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>तीव्र ग्रह ट्रिगर का कार्य करते हैं जो मन्द ग्रह गोचर द्वारा प्रतिश्रुत घटनाओं के सटीक प्रकटीकरण का समय निर्धारित करते हैं। सूर्य लगभग 1 मास में एक राशि पार करता है, चन्द्रमा लगभग 2.25 दिन में, बुध 25 दिन से 2 मास में (वक्री के अनुसार), शुक्र लगभग 1 मास में और मंगल लगभग 45 दिन में। जब अनेक तीव्र ग्रह एक साथ किसी संवेदनशील बिन्दु को सक्रिय करते हैं जो पहले से मन्द ग्रह द्वारा उत्तेजित है, तब घटनाएँ साकार होती हैं।</> : <>Fast-moving planets act as triggers that time the exact manifestation of events promised by slow-planet transits. The Sun transits a sign in about 1 month, the Moon in about 2.25 days, Mercury in 25 days to 2 months (varying with retrograde), Venus in about 1 month, and Mars in about 45 days. When multiple fast planets simultaneously activate a sensitive point already stimulated by a slow planet, events crystallize.</>}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Transit from Moon Sign                                    */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Transit from Moon Sign', hi: 'चन्द्र राशि से गोचर', sa: 'चन्द्र राशि से गोचर' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वैदिक ज्योतिष में चन्द्र राशि (जन्म राशि) गोचर मूल्यांकन का प्राथमिक सन्दर्भ बिन्दु है, पश्चिमी ज्योतिष के विपरीत जो सूर्य राशि का उपयोग करता है। चन्द्रमा मन (मनस), भावनात्मक अनुभव और उस व्यक्तिपरक दृष्टि का प्रतिनिधि है जिससे हम जीवन की घटनाओं को देखते हैं। चूँकि गोचर फल मूलतः बदलती परिस्थितियों के अनुभव के बारे में है, चन्द्र लग्न स्वाभाविक आधार है।</> : <>In Vedic astrology, the Moon sign (Janma Rashi) is the primary reference point for evaluating transits, unlike Western astrology which uses the Sun sign. The Moon represents the mind (Manas), emotional experience, and the subjective lens through which we perceive life events. Since transit effects are fundamentally about how we experience changing circumstances, Chandra Lagna is the natural anchor.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Jupiter Transit Results', hi: 'गुरु गोचर फल', sa: 'गुरु गोचर फल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">शुभ (चन्द्र से 2, 5, 7, 9, 11):</span> 2वें में गुरु धन और पारिवारिक सामंजस्य लाता है; 5वें में बुद्धि, सन्तान और पुण्य; 7वें में विवाह और साझेदारी; 9वें में भाग्य, धर्म और गुरु कृपा; 11वें में लाभ, इच्छापूर्ति और सामाजिक सफलता।</> : <><span className="text-gold-light font-medium">Favorable (2, 5, 7, 9, 11 from Moon):</span> Jupiter in the 2nd brings wealth and family harmony; in the 5th, intelligence, children, and spiritual merit; in the 7th, marriage and partnerships; in the 9th, fortune, dharma, and guru blessings; in the 11th, gains, fulfillment of desires, and social success.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-red-400 font-medium">Challenging (1, 3, 4, 6, 8, 10, 12):</span> Jupiter in these houses brings comparatively muted results — expenses, obstacles, or slow progress. However, Jupiter being a natural benefic rarely causes severe harm even in unfavorable positions.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Saturn Transit Results', hi: 'शनि गोचर फल', sa: 'शनि गोचर फल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-emerald-400 font-medium">शुभ (चन्द्र से 3, 6, 11):</span> 3वें में शनि साहस और प्रतिद्वन्द्वियों पर विजय देता है; 6वें में शत्रु पराजय और स्वास्थ्य सुधार; 11वें में आर्थिक लाभ और दीर्घकालिक लक्ष्यों की प्राप्ति। चन्द्रमा से ये शनि की एकमात्र सुखद स्थितियाँ हैं।</> : <><span className="text-emerald-400 font-medium">Favorable (3, 6, 11 from Moon):</span> Saturn in the 3rd gives courage and victory over rivals; in the 6th, defeat of enemies and improved health; in the 11th, financial gains and achievement of long-term goals. These are Saturn&apos;s only comfortable positions from the Moon.</>}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Ashtakavarga System                                       */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Ashtakavarga System', hi: 'अष्टकवर्ग पद्धति', sa: 'अष्टकवर्ग पद्धति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अष्टकवर्ग पद्धति गोचर भविष्यवाणी को सूक्ष्म बनाने का सर्वाधिक शक्तिशाली उपकरण है। 7 ग्रहों (सूर्य से शनि तक) में प्रत्येक को 12 राशियों में 8 स्रोतों से शुभ बिन्दु प्राप्त होते हैं: 7 ग्रह और लग्न। किसी राशि में ग्रह को अधिकतम 8 बिन्दु मिल सकते हैं। यदि ग्रह को किसी राशि में 4 या अधिक बिन्दु हों, तो उस राशि में उसका गोचर शुभ रहता है; 0-3 बिन्दु हों तो गोचर कठिन रहने की सम्भावना है।</> : <>The Ashtakavarga system is one of the most powerful tools for refining transit predictions. Each of the 7 planets (Sun through Saturn) receives benefic points (bindus) in each of the 12 signs from 8 sources: the 7 planets plus the Lagna. The maximum bindus a planet can receive in any sign is 8. If a planet has 4 or more bindus in a sign, its transit through that sign tends to be favorable; with 0-3 bindus, the transit is likely challenging.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Sarvashtakavarga (SAV)', hi: 'सर्वाष्टकवर्ग', sa: 'सर्वाष्टकवर्ग' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">कुल अंक:</span> सर्वाष्टकवर्ग सभी 7 ग्रहों के व्यक्तिगत अष्टकवर्ग को एक सारांश में जोड़ता है। प्रत्येक राशि को 56 में से कुल अंक मिलता है (7 ग्रह x अधिकतम 8 बिन्दु)। 28 या अधिक SAV अंक वाली राशियाँ सामान्यतः शुभ हैं — इन राशियों से गोचर करने वाले ग्रह सामान्य गोचर नियम की परवाह किए बिना बेहतर फल देते हैं।</> : <><span className="text-gold-light font-medium">Total Score:</span> The Sarvashtakavarga combines all 7 individual planet Ashtakavarga charts into one summary. Each sign gets a total score out of 56 (7 planets x 8 maximum bindus). Signs with 28 or more SAV points are generally auspicious — planets transiting these signs deliver better results regardless of the general transit rule.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Practical Application', hi: 'व्यावहारिक प्रयोग', sa: 'व्यावहारिक प्रयोग' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> चन्द्र से 8वें भाव में शनि गोचर सामान्यतः अत्यन्त कठिन है। परन्तु यदि जातक के अष्टकवर्ग में उस राशि में शनि के 5 बिन्दु हों, तो गोचर काफी शमित होगा — चुनौतियाँ हैं परन्तु सम्भालने योग्य हैं और छिपे लाभ भी ला सकता है (8वें भाव का रूपान्तरण)।</> : <><span className="text-gold-light font-medium">Example:</span> Saturn transiting the 8th from Moon is generally very difficult. But if Saturn has 5 bindus in that sign in the native&apos;s Ashtakavarga chart, the transit will be significantly mitigated — challenges exist but are manageable and may even bring hidden gains (8th house transformation).</>}</p>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरण कुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Conversely:</span> Jupiter in the 5th from Moon is classically excellent. But if Jupiter has only 1-2 bindus in that sign, the promised bounty may be delayed, partial, or manifest through struggle rather than ease. Ashtakavarga reveals the hidden quality behind the surface-level transit rule.
        </p>
      </section>
    </div>
  );
}

export default function Module12_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


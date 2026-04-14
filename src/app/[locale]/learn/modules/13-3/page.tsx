'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/13-3.json';

const META: ModuleMeta = {
  id: 'mod_13_3', phase: 3, topic: 'Yogas', moduleNumber: '13.3',
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
          {tl({ en: 'Mangal Dosha', hi: 'मंगल दोष', sa: 'मंगल दोष' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मंगल दोष (कुज दोष या माँगलिक भी कहा जाता है) भारतीय विवाह ज्योतिष में सर्वाधिक चर्चित दोष है। यह तब बनता है जब मंगल लग्न, चन्द्र राशि या शुक्र से 1ले, 2रे, 4थे, 7वें, 8वें या 12वें भाव में हो। ये छह भाव विवाह और गृहस्थ जीवन से सीधे सम्बन्धित हैं — स्वयं (1ला), परिवार (2रा), गृह शान्ति (4था), जीवनसाथी (7वाँ), वैवाहिक आयु (8वाँ) और शय्या सुख (12वाँ)। इन संवेदनशील भावों में मंगल की अग्नि, आक्रामक ऊर्जा विवाह में संघर्ष, प्रभुत्व समस्याएँ या शारीरिक खतरे बना सकती है।</> : <>Mangal Dosha (also called Kuja Dosha or Manglik) is the most commonly discussed dosha in Indian marriage astrology. It forms when Mars (Mangal) is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon sign, or Venus. These six houses directly relate to marriage and domestic life — self (1st), family (2nd), domestic peace (4th), spouse (7th), marital longevity (8th), and bed pleasures (12th). Mars&apos;s fiery, aggressive energy in these sensitive houses can create conflict, dominance issues, or physical dangers in marriage.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: '6 Cancellation Conditions', hi: '6 निवारण शर्तें', sa: 'षट् निरसनशर्ताः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1. Jupiter&apos;s aspect on Mars:</span> Jupiter&apos;s benevolent gaze on Mars tames its aggression. The native channels Mars energy constructively — passion becomes purposeful drive rather than destructive force.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">2. Mars in own or exalted sign:</span> Mars in Aries, Scorpio (own) or Capricorn (exalted) is dignified and well-behaved. A strong Mars does not create domestic chaos — it provides protection and courage instead.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">3. Same dosha in partner&apos;s chart:</span> Two Manglik individuals balance each other. The fiery energies match rather than clash — this is the most commonly applied cancellation rule.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">4. Mars in specific signs (Aries, Scorpio, Capricorn):</span> Mars in these signs is comfortable and does not produce the negative effects typically associated with Mangal Dosha.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">5. Benefic conjunction:</span> A benefic planet (Jupiter, Venus, well-placed Mercury) conjunct Mars softens its energy and redirects it positively.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">6. Mars beyond 28° in the sign:</span> When Mars is at the very end of a sign (past 28°), its energy is transitioning and significantly weakened, reducing the dosha&apos;s impact.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Kala Sarpa Dosha                                          */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Kala Sarpa Dosha', hi: 'काल सर्प दोष', sa: 'काल सर्प दोष' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>काल सर्प दोष (शाब्दिक &quot;काल का सर्प&quot;) तब बनता है जब सभी सात दृश्य ग्रह (सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि) राहु-केतु अक्ष के एक ओर हों। कल्पना करें कि जन्म कुण्डली राहु-केतु रेखा द्वारा विभाजित वृत्त है — यदि सभी ग्रह एक आधे में हों तो दूसरा आधा पूर्णतः खाली है। इससे ऊर्जा का तीव्र केन्द्रीकरण और तदनुरूपी शून्य बनता है, जो चरम का जीवन उत्पन्न करता है — उल्लेखनीय उपलब्धियों और अकथनीय विपत्तियों का आवर्तन।</> : <>Kala Sarpa Dosha (literally &quot;serpent of time&quot;) forms when all seven visible planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are contained on one side of the Rahu-Ketu axis. Imagine the birth chart as a circle divided by the Rahu-Ketu line — if all planets fall on one half, the other half is completely empty. This creates an intense concentration of energy and a corresponding void, producing a life of extremes — periods of remarkable achievement alternating with inexplicable setbacks.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Partial vs Complete', hi: 'आंशिक बनाम पूर्ण', sa: 'आंशिक बनाम पूर्ण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">पूर्ण काल सर्प:</span> सभी 7 ग्रह राहु और केतु के बीच सख्ती से हों, कोई ग्रह किसी पात के साथ संयुक्त न हो। यह पूर्ण बल का दोष है। प्रभावों में करियर-सम्बन्ध असन्तुलन, भाग्य का अचानक पलटना और कार्मिक चक्र में फँसे होने का अनुभव सम्मिलित है।</> : <><span className="text-gold-light font-medium">Complete Kala Sarpa:</span> All 7 planets strictly between Rahu and Ketu with no planet conjunct either node. This is the full-strength dosha. Effects include career-relationship imbalance, sudden reversals of fortune, and a feeling of being caught in a karmic loop.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Partial Kala Sarpa:</span> One or more planets conjunct Rahu or Ketu (within ~5°), sitting on the boundary. This significantly reduces the dosha&apos;s intensity. The boundary planet acts as a bridge between the concentrated and empty halves, allowing energy to flow more freely.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Effects on Life', hi: 'जीवन पर प्रभाव', sa: 'जीवन पर प्रभाव' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Kala Sarpa natives often experience: delayed marriage or career establishment, sudden rises followed by unexpected falls, intense spiritual experiences, feeling &quot;different&quot; from peers, and a strong pull toward unconventional paths. Many highly successful individuals have Kala Sarpa — the concentrated energy, when channeled properly, produces extraordinary results in one area of life.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Cancellation:</span> An exalted planet within the hemmed arc provides enough strength to counteract the dosha. Some texts also consider the dosha cancelled after age 33 (half of the Rahu-Ketu 18-year cycle plus buffer). Remedial measures include Rahu-Ketu puja, Naga Panchami observances, and Kala Sarpa Shanti rituals.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Other Doshas & Remedial Principle                         */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Other Doshas & Remedial Principles', hi: 'अन्य दोष एवं उपचार सिद्धान्त', sa: 'अन्य दोष एवं उपचार सिद्धान्त' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मंगल और काल सर्प के अतिरिक्त, कुण्डली विश्लेषण में कई अन्य दोष बार-बार दिखते हैं। प्रत्येक एक विशिष्ट कार्मिक प्रतिमान है — शाप नहीं, बल्कि विरासत में मिली प्रवृत्ति जो पूर्वानुमेय चुनौतियाँ बनाती है। दोष समझना पहला कदम है; उपचार दूसरा। वैदिक परम्परा प्रत्येक दोष के लिए विशिष्ट प्रतिउपाय प्रदान करती है — आध्यात्मिक साधना, दान, रत्न और सचेत व्यवहार समायोजन का संयोजन।</> : <>Beyond Mangal and Kala Sarpa, several other doshas appear frequently in chart analysis. Each represents a specific karmic pattern — not a curse, but an inherited tendency that creates predictable challenges. Understanding the dosha is the first step; remediation is the second. Vedic tradition provides specific countermeasures for each dosha, combining spiritual practice, charity, gemstones, and conscious behavioral adjustment.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Pitra Dosha', hi: 'पितृ दोष', sa: 'पितृ दोष' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Formation:</span> Sun conjunct Rahu, Sun conjunct Saturn, or severe affliction to the 9th house (ancestors). The 9th house represents father, forefathers, and inherited merit (punya). When afflicted, ancestral karmic debts remain unresolved.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Effects:</span> Recurring obstacles in progeny, career blocks that defy logical explanation, persistent pattern of near-misses, strained father-child relationships, and a sense of being held back by invisible forces.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Remedies:</span> Shraddha rituals for ancestors (Pind Daan at Gaya), Pitru Tarpanam during Pitru Paksha, feeding Brahmins, planting Peepal trees, and regular offerings to departed souls.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Guru Chandal & Shrapit', hi: 'गुरु चाण्डाल एवं शापित', sa: 'गुरु चाण्डाल एवं शापित' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">गुरु चाण्डाल (गुरु + राहु):</span> ज्ञान और धार्मिक बोध को दूषित करता है। जातक गलत गुरुओं का अनुसरण कर सकता है, अपरम्परागत या भ्रामक मान्यताएँ रख सकता है, या शिक्षकों और मार्गदर्शकों से समस्याएँ झेल सकता है।</> : <><span className="text-gold-light font-medium">Guru Chandal (Jupiter + Rahu):</span> Corrupts wisdom and dharmic sense. The native may follow false gurus, hold unorthodox or misguided beliefs, or face problems with teachers and mentors. Remedies: strengthen Jupiter with yellow sapphire, recite Guru (Brihaspati) mantras, and donate to educational institutions.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">शापित दोष (शनि + राहु):</span> अकथनीय अवरोध और विलम्ब बनाता है। जातक को जिस भाव में यह संयोग हो वहाँ शापित या दीर्घकालिक दुर्भाग्यशाली अनुभव हो सकता है। पूर्वजन्म ऋण वर्तमान जीवन में बाधाएँ बनाते हैं।</> : <><span className="text-gold-light font-medium">Shrapit Dosha (Saturn + Rahu):</span> Creates inexplicable blocks and delays. The native may feel cursed or chronically unlucky in the house where this conjunction falls. Past-life debts create present-life obstacles. Remedies: Saturn mantras, Rahu pacification, feeding the poor on Saturdays, and Hanuman worship.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Remedial Principle', hi: 'उपचार सिद्धान्त', sa: 'उपचार सिद्धान्त' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>दोष कार्मिक प्रतिमान प्रकट करते हैं — दण्ड नहीं। उपचार सिद्धान्त त्रिविध है: (1) <span className="text-gold-light font-medium">कमजोर को मजबूत करें:</span> दोष प्रतिकार करने वाले शुभ ग्रहों के लिए रत्न और मन्त्र। (2) <span className="text-gold-light font-medium">पीड़ित को शान्त करें:</span> दोष कारक पापी ग्रह के लिए दान, उपवास और मन्त्र। (3) <span className="text-gold-light font-medium">सचेत जागरूकता:</span> प्रतिमान समझना भिन्न चयन करने देता है — कुण्डली मानचित्र है, बन्दीगृह नहीं।</> : <>Doshas reveal karmic patterns — not punishments. The principle behind remedies is threefold: (1) <span className="text-gold-light font-medium">Strengthen the weak:</span> Gemstones and mantras for benefic planets that can counteract the dosha. (2) <span className="text-gold-light font-medium">Pacify the afflicting:</span> Charity, fasting, and mantras for the malefic planet causing the dosha. (3) <span className="text-gold-light font-medium">Conscious awareness:</span> Understanding the pattern allows you to make different choices — the chart is a map, not a prison.</>}</p>
      </section>
    </div>
  );
}

export default function Module13_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


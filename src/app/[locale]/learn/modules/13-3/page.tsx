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

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Dosha Interactions and Compound Effects', hi: 'दोष अन्तःक्रिया और यौगिक प्रभाव', sa: 'दोष अन्तःक्रिया और यौगिक प्रभाव' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कुण्डली में एक से अधिक दोष हो सकते हैं। एक जातक में मंगल दोष (मंगल 7वें में) और काल सर्प दोष दोनों हो सकते हैं। ये स्वतन्त्र प्रतिमान हैं जो भिन्न जीवन क्षेत्रों को प्रभावित करते हैं &mdash; मंगल दोष विवाह को, काल सर्प समग्र जीवन पथ को। उपचार भी स्वतन्त्र हैं: मंगल दोष के लिए कुम्भ विवाह, काल सर्प के लिए नाग पंचमी पूजा।</> : <>A chart can contain multiple doshas simultaneously. A native may have both Mangal Dosha (Mars in the 7th) and Kala Sarpa Dosha. These are independent patterns affecting different life areas &mdash; Mangal Dosha targets marriage, Kala Sarpa affects the overall life trajectory. Remedies are also independent: Kumbha Vivah for Mangal Dosha, Naga Panchami puja for Kala Sarpa.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed">{isHi ? <>हमारा टिप्पणी इंजन प्रत्येक दोष का स्वतन्त्र रूप से पता लगाता है और उनके संयुक्त प्रभाव का आकलन करता है। जब कई दोष उपस्थित हों, इंजन तीव्रता के क्रम में प्राथमिकता देता है और सर्वाधिक प्रभावशाली दोष के लिए उपचार को पहले सूचीबद्ध करता है। यह दृष्टिकोण जातक को भ्रमित या भयभीत किये बिना, व्यवस्थित रूप से प्रत्येक चुनौती का समाधान करने देता है।</> : <>Our tippanni engine detects each dosha independently and assesses their compound effect. When multiple doshas are present, the engine prioritizes by severity and lists remedies for the most impactful dosha first. This approach allows the native to systematically address each challenge without being overwhelmed or frightened by a list of afflictions.</>}</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example — Multiple Doshas', hi: 'कार्यान्वित उदाहरण — बहु दोष', sa: 'कार्यान्वित उदाहरण — बहु दोष' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'कुण्डली:' : 'Chart:'}</span> {isHi ? <>तुला लग्न। मंगल 7वें भाव (मेष) में। सूर्य राहु के साथ 12वें में। सभी ग्रह राहु-केतु अक्ष के एक ओर।</> : <>Libra Lagna. Mars in the 7th house (Aries). Sun conjunct Rahu in the 12th. All planets on one side of the Rahu-Ketu axis.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'दोष पहचान:' : 'Dosha Detection:'}</span> {isHi ? <>1) मंगल दोष &mdash; मंगल 7वें में (मध्यम-गम्भीर)। लेकिन मंगल स्वराशि मेष में = निरसन शर्त #1। तीव्रता: शून्य (निरस्त)। 2) पितृ दोष &mdash; सूर्य + राहु 12वें में। 9वें भाव (पिता/पूर्वज) को प्रत्यक्ष पीड़ा नहीं, किन्तु सूर्य-राहु युति पितृ कर्म दर्शाती है। तीव्रता: मध्यम। 3) काल सर्प &mdash; सभी ग्रह एक ओर। किन्तु मंगल राहु पर (7वें = राहु से 180° विपरीत) &mdash; आंशिक काल सर्प। तीव्रता: हल्की।</> : <>1) Mangal Dosha &mdash; Mars in 7th (moderate-severe). BUT Mars is in own sign Aries = cancellation condition #1. Severity: Nil (cancelled). 2) Pitra Dosha &mdash; Sun + Rahu in 12th. Not a direct affliction to 9th (father/ancestors), but Sun-Rahu conjunction indicates ancestral karma. Severity: Moderate. 3) Kala Sarpa &mdash; all planets on one side. But Mars is at the Rahu end (7th = 180 degrees from Rahu) &mdash; Partial Kala Sarpa. Severity: Mild.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'उपचार प्राथमिकता:' : 'Remedy priority:'}</span> {isHi ? <>1) पितृ दोष (मध्यम) &mdash; पितृ पक्ष में श्राद्ध, पीपल वृक्ष रोपण। 2) आंशिक काल सर्प (हल्का) &mdash; नाग पंचमी पूजा। मंगल दोष निरस्त होने से कोई विवाह-विशिष्ट उपचार आवश्यक नहीं।</> : <>1) Pitra Dosha (moderate) &mdash; Shraddha during Pitru Paksha, plant a Peepal tree. 2) Partial Kala Sarpa (mild) &mdash; Naga Panchami puja. Since Mangal Dosha is cancelled, no marriage-specific remedy needed.</>}</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;काल सर्प दोष का उल्लेख शास्त्रीय ग्रन्थों में नहीं है, इसलिए यह मान्य नहीं।&quot; यह सत्य है कि BPHS में इसका प्रत्यक्ष उल्लेख नहीं है। किन्तु &quot;सभी ग्रह एक अर्ध-वृत्त में&quot; का प्रतिमान अनुभवजन्य रूप से चरम जीवन पथों से सहसम्बद्ध पाया गया है। शास्त्रीय उल्लेख की अनुपस्थिति इसे अमान्य नहीं बनाती &mdash; शास्त्र ज्ञान का एकमात्र स्रोत नहीं हैं।</> : <>&quot;Kala Sarpa Dosha is not mentioned in classical texts, so it is not valid.&quot; It is true that BPHS does not directly mention it. However, the pattern of &quot;all planets in one semicircle&quot; has been empirically correlated with extreme life trajectories. Absence from classical texts does not invalidate it &mdash; texts are not the sole source of knowledge.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;दोष वाला व्यक्ति सफल नहीं हो सकता।&quot; इतिहास के अनेक सफलतम व्यक्तियों की कुण्डली में गम्भीर दोष हैं। अब्राहम लिंकन, महात्मा गाँधी जैसे व्यक्तित्वों में काल सर्प समान प्रतिमान देखे गए हैं। दोष बाधा है, असम्भावना नहीं। जागरूकता और उपचार के साथ, दोष को शक्ति में बदला जा सकता है।</> : <>&quot;A person with doshas cannot be successful.&quot; Many of history&rsquo;s most successful individuals had severe doshas in their charts. Figures like Abraham Lincoln and Mahatma Gandhi showed Kala Sarpa-like patterns. A dosha is a challenge, not an impossibility. With awareness and remediation, doshas can be transmuted into strengths.</>}</p>
      </section>
    </div>
  );
}

export default function Module13_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}


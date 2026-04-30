'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/20-3.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_20_3', phase: 7, topic: 'KP System', moduleNumber: '20.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'KP significators work through a 4-level chain: a planet signifies houses through what it owns, occupies, and whose star/sub it is placed in.',
          'The strongest significator is the one connected to a house at all 4 levels — that planet\'s dasha periods will trigger the house\'s events.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The 4-Level Significator System', hi: '4-स्तरीय कारक पद्धति', sa: '4-स्तरीय कारक पद्धति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'In KP astrology, every planet is connected to certain houses through a precise 4-level hierarchy. Understanding these levels is essential because they determine WHICH planets will deliver results for WHICH life areas, and in what order of strength. Unlike traditional astrology where house lordship dominates, KP gives the highest priority to occupancy and star-lord connections.', hi: 'केपी ज्योतिष में प्रत्येक ग्रह एक सटीक 4-स्तरीय पदानुक्रम के माध्यम से कुछ भावों से जुड़ा होता है। इन स्तरों को समझना आवश्यक है क्योंकि ये निर्धारित करते हैं कि कौन-से ग्रह किन जीवन क्षेत्रों के लिए परिणाम देंगे, और प्रबलता के किस क्रम में। पारम्परिक ज्योतिष जहाँ भाव स्वामित्व प्रधान है, वहीं केपी निवास और नक्षत्र-स्वामी सम्बन्धों को सर्वोच्च प्राथमिकता देता है।', sa: 'केपी ज्योतिष में प्रत्येक ग्रह एक सटीक 4-स्तरीय पदानुक्रम के माध्यम से कुछ भावों से जुड़ा होता है। इन स्तरों को समझना आवश्यक है क्योंकि ये निर्धारित करते हैं कि कौन-से ग्रह किन जीवन क्षेत्रों के लिए परिणाम देंगे, और प्रबलता के किस क्रम में। पारम्परिक ज्योतिष जहाँ भाव स्वामित्व प्रधान है, वहीं केपी निवास और नक्षत्र-स्वामी सम्बन्धों को सर्वोच्च प्राथमिकता देता है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>स्तर 1 (सबसे प्रबल): भाव में भौतिक रूप से निवासी ग्रह। यदि मंगल सप्तम भाव में बैठा है, तो मंगल सप्तम का स्तर 1 कारक है। स्तर 2: स्तर 1 निवासी के नक्षत्र (तारा) में स्थित ग्रह। यदि मंगल सप्तम में है और शनि मृगशिरा (मंगल-शासित नक्षत्र) में है, तो शनि सप्तम का स्तर 2 कारक बनता है। स्तर 3: भाव सन्धि पर स्थित राशि का स्वामी ग्रह। यदि सप्तम सन्धि पर तुला है, तो शुक्र (तुला स्वामी) स्तर 3 कारक है। स्तर 4 (सबसे दुर्बल): स्तर 3 स्वामी के नक्षत्र में स्थित ग्रह।</>
            : <>Level 1 (Strongest): Planets physically OCCUPYING a house. If Mars sits in the 7th house, Mars is a Level 1 significator of the 7th house. Level 2: Planets placed in the NAKSHATRA (star) of a Level 1 occupant. If Mars occupies the 7th and Saturn is in Mrigashira (a Mars-ruled nakshatra), Saturn becomes a Level 2 significator of the 7th. Level 3: Planets OWNING the sign on the house cusp. If Libra is on the 7th cusp, Venus (Libra&apos;s lord) is a Level 3 significator. Level 4 (Weakest): Planets in the nakshatra of a Level 3 owner.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>&quot;ग्रह जिस नक्षत्र में बैठता है उसके स्वामी का फल देता है&quot; यह अवधारणा वैदिक ज्योतिष के नाड़ी ग्रन्थों तक जाती है। कृष्णमूर्ति ने इस सिद्धान्त को विस्तारित करके एक औपचारिक 4-स्तरीय पदानुक्रम में व्यवस्थित किया: ग्रह न केवल अपने नक्षत्र स्वामी का फल देता है, बल्कि उसके नक्षत्रों में स्थित ग्रह उसके भाव कारकत्व को प्रवाहित करते हैं। यह द्विदिशात्मक नक्षत्र-स्वामी सिद्धान्त केपी का सबसे शक्तिशाली विश्लेषणात्मक उपकरण है, पारम्परिक स्वामित्व-आधारित विश्लेषण से कहीं अधिक विभेदक।</>
            : <>The concept that &quot;a planet gives the results of the lord of the nakshatra it occupies&quot; traces back to Vedic astrology&apos;s nadi grantha texts. Krishnamurti systematized this into a formal 4-level hierarchy by extending the principle: not only does a planet give results of its star lord, but planets in ITS stars channel its house significations. This bidirectional star-lord principle is KP&apos;s most powerful analytical tool, far more discriminating than traditional ownership-based analysis.</>}
        </p>
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
          {tl({ en: 'Building the Significator Table', hi: 'कारक सारणी निर्माण', sa: 'कारक सारणी निर्माण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>कारक सारणी बनाने के लिए, प्रत्येक भाव (1 से 12) का विश्लेषण करें और 4 स्तरों में से प्रत्येक पर जुड़े सभी ग्रहों को सूचीबद्ध करें। स्तर 1 से आरम्भ करें: कौन-से ग्रह भाव में बैठे हैं? फिर स्तर 2: कौन-से ग्रह उन निवासियों के नक्षत्रों में हैं? फिर स्तर 3: सन्धि पर स्थित राशि का स्वामी कौन-सा ग्रह है? अन्त में स्तर 4: उस स्वामी के नक्षत्र में कौन-से ग्रह हैं? परिणाम प्रत्येक ग्रह के भाव कारकत्व का व्यापक मानचित्र है।</>
            : <>To build the significator table, you analyze each house (1 through 12) and list all planets connected to it at each of the 4 levels. Start with Level 1: which planets occupy the house? Then Level 2: which planets are in the nakshatras of those occupants? Then Level 3: which planet owns the sign on the cusp? Finally Level 4: which planets are in the nakshatra of that owner? The result is a comprehensive map of every planet&apos;s house significations.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For predicting a specific event, identify the relevant house group. Marriage = houses 2, 7, 11. Career = houses 2, 6, 10, 11. Foreign travel = houses 3, 9, 12. Then find all planets that signify the relevant houses at strong levels (ideally Levels 1-2). The planet with the strongest combined signification of the event&apos;s houses will deliver the event during its dasha/bhukti/antara period.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">विवाह विश्लेषण:</span> भाव 2, 7, 11 विवाह समूह हैं। सप्तम भाव में गुरु (स्तर 1)। गुरु के नक्षत्रों (पुनर्वसु, विशाखा, पूर्वा भाद्रपद) में: शुक्र, बुध (सप्तम के स्तर 2 कारक)। सप्तम सन्धि पर तुला — स्वामी शुक्र (स्तर 3)। शुक्र के नक्षत्रों (भरणी, पूर्वा फाल्गुनी, पूर्वाषाढ़ा) में: सूर्य, मंगल (स्तर 4)। इसी प्रकार द्वितीय और एकादश भाव के लिए बनाएँ। शुक्र स्तर 2 (सप्तम) + स्तर 3 (सप्तम) + सम्भवतः द्वितीय/एकादश का स्तर 1 या 2 = शुक्र सबसे प्रबल विवाह कारक है। विवाह शुक्र दशा या भुक्ति में सर्वाधिक सम्भावित।</>
            : <><span className="text-gold-light font-medium">Marriage analysis:</span> Houses 2, 7, 11 are the marriage group. 7th house contains Jupiter (Level 1). Planets in Jupiter&apos;s stars (Punarvasu, Vishakha, Purva Bhadrapada): Venus, Mercury (Level 2 significators of 7th). 7th cusp has Libra — owner Venus (Level 3). Planets in Venus&apos;s stars (Bharani, Purva Phalguni, Purva Ashadha): Sun, Mars (Level 4). Similarly build for 2nd and 11th houses. Venus appears as Level 2 (7th) + Level 3 (7th) + perhaps Level 1 or 2 for 2nd/11th = Venus is the strongest marriage significator. Marriage most likely in Venus dasha or bhukti.</>}
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
          {tl({ en: 'Resolving Conflicts', hi: 'विरोधाभास समाधान', sa: 'विरोधाभास समाधान' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>व्यवहार में, अनेक ग्रह किसी दी गई घटना के लिए अनुकूल और प्रतिकूल दोनों भावों का कारक होते हैं। शुक्र स्तर 2 पर सप्तम भाव (विवाह) का कारक हो सकता है किन्तु स्तर 1 पर द्वादश भाव (वियोग, हानि) का भी। क्या इसका अर्थ तलाक सहित विवाह है? आवश्यक नहीं। केपी ऐसे विरोधाभासों का समाधान उप स्वामी सम्बन्ध द्वारा करता है। शुक्र के उप स्वामी की जाँच करें: यदि शुक्र का उप-स्वामी भाव 2, 7, 11 का 6, 8, 12 से अधिक प्रबल कारक है, तो शुक्र विवाह देगा — सम्भवतः कुछ चुनौतियों सहित (द्वादश भाव का स्पर्श), किन्तु अन्ततः सकारात्मक।</>
            : <>In practice, many planets signify BOTH favorable and unfavorable houses for a given event. Venus might signify the 7th house (marriage) at Level 2 but also the 12th house (separation, loss) at Level 1. Does this mean marriage with divorce? Not necessarily. KP resolves such conflicts through the Sub Lord connection. Examine Venus&apos;s Sub Lord: if Venus&apos;s sub-lord signifies 2, 7, 11 more strongly than 6, 8, 12, then Venus will deliver marriage — perhaps with some challenges (the 12th house touch), but ultimately positive.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          If the sub-lord tilts toward 6, 8, 12, then Venus&apos;s period may bring relationship difficulties or denial of marriage. This sub-lord tiebreaker is what makes KP&apos;s predictions so specific — it does not just say &quot;Venus is related to marriage&quot; but specifies whether Venus will actually DELIVER marriage or create obstacles.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;केपी में भी पाराशरी की तरह केवल भाव स्वामित्व ही मायने रखता है।&quot; पाराशरी से केपी में जाने पर यह सबसे सामान्य त्रुटि है। केपी में स्वामित्व (स्तर 3) वास्तव में निवासी से नक्षत्र-स्वामी सम्बन्ध (स्तर 2) से दुर्बल है। सप्तम भाव निवासी के नक्षत्र में ग्रह स्वयं सप्तम भाव स्वामी से प्रबल विवाह सूचक है। प्राथमिकताओं का यह उलटाव केपी का मूलभूत सिद्धान्त है और इसकी उपेक्षा गलत फलादेश देती है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;In KP, only house ownership matters, just like in Parashari.&quot; This is the most common error when transitioning from Parashari to KP. In KP, ownership (Level 3) is actually WEAKER than star-lord connection to an occupant (Level 2). A planet in the star of a 7th house occupant is a stronger marriage indicator than the 7th house owner itself. This reversal of priorities is fundamental to KP and ignoring it leads to incorrect predictions.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Building the significator table manually for all 12 houses is tedious work that used to take KP practitioners 30-60 minutes per chart. Our KP System tool automates this entirely — it computes all 4 levels of significatorship for every planet across all 12 houses and presents a clean, sortable significator table. This allows the astrologer to immediately see which planets are the strongest significators for any event, dramatically speeding up the analysis process while eliminating human calculation errors.', hi: 'सभी 12 भावों के लिए कारक सारणी मैनुअली बनाना थकाऊ कार्य है जिसमें केपी अभ्यासकर्ताओं को प्रति कुण्डली 30-60 मिनट लगते थे। हमारा केपी सिस्टम उपकरण इसे पूर्णतः स्वचालित करता है — यह सभी 12 भावों में प्रत्येक ग्रह के लिए कारकत्व के सभी 4 स्तर गणित करता है और एक स्वच्छ, क्रमबद्ध कारक सारणी प्रस्तुत करता है। इससे ज्योतिषी तत्काल देख सकता है कि किसी भी घटना के लिए कौन-से ग्रह सबसे प्रबल कारक हैं, जो मानवीय गणना त्रुटियों को समाप्त करते हुए विश्लेषण प्रक्रिया को नाटकीय रूप से तेज़ करता है।', sa: 'सभी 12 भावों के लिए कारक सारणी मैनुअली बनाना थकाऊ कार्य है जिसमें केपी अभ्यासकर्ताओं को प्रति कुण्डली 30-60 मिनट लगते थे। हमारा केपी सिस्टम उपकरण इसे पूर्णतः स्वचालित करता है — यह सभी 12 भावों में प्रत्येक ग्रह के लिए कारकत्व के सभी 4 स्तर गणित करता है और एक स्वच्छ, क्रमबद्ध कारक सारणी प्रस्तुत करता है। इससे ज्योतिषी तत्काल देख सकता है कि किसी भी घटना के लिए कौन-से ग्रह सबसे प्रबल कारक हैं, जो मानवीय गणना त्रुटियों को समाप्त करते हुए विश्लेषण प्रक्रिया को नाटकीय रूप से तेज़ करता है।' }, locale)}
        </p>
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
          {tl({ en: 'KP Ruling Planets — Quick Confirmation', hi: 'केपी शासक ग्रह — त्वरित पुष्टि', sa: 'केपी शासक ग्रह — त्वरित पुष्टि' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Ruling Planets (RPs) are the planets governing the current moment — the day lord, Moon star lord, Moon sign lord, Lagna star lord, and Lagna sign lord at the time of judgment. KP uses RPs as a quick confirmation technique: if the significators identified through the 4-level system also appear among the current Ruling Planets, the event is very likely to happen. If none of the significators match the RPs, the timing may not be right even if the significator table is favorable.', hi: 'शासक ग्रह (RP) वर्तमान क्षण को शासित करने वाले ग्रह हैं — विचार समय पर दिन स्वामी, चन्द्र नक्षत्र स्वामी, चन्द्र राशि स्वामी, लग्न नक्षत्र स्वामी और लग्न राशि स्वामी। केपी RP को त्वरित पुष्टि तकनीक के रूप में प्रयोग करता है: यदि 4-स्तरीय पद्धति से पहचाने गए कारक वर्तमान शासक ग्रहों में भी दिखें, तो घटना होने की सम्भावना बहुत अधिक है।', sa: 'शासक ग्रह (RP) वर्तमान क्षण को शासित करने वाले ग्रह हैं।' }, locale)}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Additional Misconceptions', hi: 'अतिरिक्त भ्रान्तियाँ', sa: 'अतिरिक्त भ्रान्तियाँ' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;केपी पद्धति पाराशरी से श्रेष्ठ है।&quot; दोनों पद्धतियों की अपनी शक्तियाँ हैं। पाराशरी जीवन की व्यापक कथा, चरित्र विश्लेषण और आध्यात्मिक विकास पथ दर्शाने में उत्कृष्ट है। केपी विशिष्ट घटना भविष्यवाणी (&quot;क्या विवाह होगा? कब?&quot;) में उत्कृष्ट है। अनेक अनुभवी ज्योतिषी दोनों प्रयोग करते हैं — पाराशरी जीवन पठन के लिए, केपी विशिष्ट प्रश्नों के लिए।</> : <>&quot;KP is superior to Parashari.&quot; Both systems have distinct strengths. Parashari excels at broad life narrative, character analysis, and spiritual growth paths. KP excels at specific event prediction (&ldquo;will marriage happen? when?&rdquo;). Many experienced astrologers use both — Parashari for life reading, KP for specific questions.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;केपी में ग्रह बल (षड्बल) अप्रासंगिक है।&quot; केपी ग्रह बल को स्पष्ट रूप से नहीं गणित करता, किन्तु ग्रह स्थिति का प्रभाव निहित है। उप-स्वामी जो नीच या अस्त है, उसी उप-स्वामी की तुलना में कमज़ोर परिणाम देगा जो स्वराशी या उच्च में है। व्यावहारिक अन्तर है।</> : <>&quot;Planetary strength (Shadbala) is irrelevant in KP.&quot; KP does not explicitly compute planetary strength, but the effect of planetary condition is implicit. A sub-lord that is debilitated or combust will deliver weaker results than the same sub-lord in own sign or exalted. The practical difference is real.</>}</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Cross-References', hi: 'सम्बन्धित मॉड्यूल', sa: 'सम्बन्धित मॉड्यूल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>केपी उप-स्वामी सारणी के लिए <span className="text-gold-light">मॉड्यूल 20.2</span> देखें। केपी प्रणाली के परिचय और प्लेसिडस भाव के लिए <span className="text-gold-light">मॉड्यूल 20.1</span> देखें। विंशोत्तरी दशा (जो केपी समय-निर्धारण का आधार है) के लिए <span className="text-gold-light">मॉड्यूल 11.1</span> देखें।</> : <>For the KP sub-lord table, see <span className="text-gold-light">Module 20.2</span>. For KP system introduction and Placidus houses, see <span className="text-gold-light">Module 20.1</span>. For Vimshottari Dasha (the basis of KP timing), see <span className="text-gold-light">Module 11.1</span>.</>}</p>
      </section>
    </div>
  );
}

export default function Module20_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

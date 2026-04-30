'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/9-2.json';

const META: ModuleMeta = {
  id: 'mod_9_2', phase: 3, topic: 'Kundali', moduleNumber: '9.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 13,
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
          {tl({ en: 'The 12 Houses: A Map of Life', hi: '12 भाव: जीवन का नक्शा', sa: '12 भाव: जीवन का नक्शा' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>12 भाव आकाश को 12 खण्डों में विभाजित करते हैं, प्रत्येक मानव अनुभव के एक विशिष्ट क्षेत्र पर शासन करता है। जन्म से मृत्यु तक, धन से मोक्ष तक, जीवन का हर पहलू इन भावों में से किसी एक में अपना स्थान पाता है। भावों को समझना किसी भी कुण्डली पढ़ने का पहला कदम है।</> : <>The 12 houses (Bhavas) divide the sky into 12 sectors, each governing a specific domain of human experience. From birth to death, from wealth to liberation, every aspect of life finds its place in one of these houses. Understanding the houses is the first step in reading any chart.</>}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { n: '1st', hi: 'प्रथम', name: 'Tanu', desc: 'Self, body, personality, appearance', hiDesc: 'आत्म, शरीर, व्यक्तित्व, रूप' },
            { n: '2nd', hi: 'द्वितीय', name: 'Dhana', desc: 'Wealth, family, speech, food', hiDesc: 'धन, परिवार, वाणी, भोजन' },
            { n: '3rd', hi: 'तृतीय', name: 'Sahaja', desc: 'Siblings, courage, short journeys, skills', hiDesc: 'भाई-बहन, साहस, लघु यात्रा, कौशल' },
            { n: '4th', hi: 'चतुर्थ', name: 'Sukha', desc: 'Mother, property, vehicles, inner peace', hiDesc: 'माता, सम्पत्ति, वाहन, मानसिक शांति' },
            { n: '5th', hi: 'पंचम', name: 'Putra', desc: 'Children, education, creativity, romance', hiDesc: 'संतान, शिक्षा, रचनात्मकता, प्रेम' },
            { n: '6th', hi: 'षष्ठ', name: 'Ripu', desc: 'Enemies, disease, debts, daily work', hiDesc: 'शत्रु, रोग, ऋण, दैनिक कार्य' },
            { n: '7th', hi: 'सप्तम', name: 'Yuvati', desc: 'Marriage, spouse, business partners', hiDesc: 'विवाह, जीवनसाथी, व्यापार साझेदार' },
            { n: '8th', hi: 'अष्टम', name: 'Randhra', desc: 'Longevity, hidden matters, inheritance', hiDesc: 'आयु, गुप्त विषय, विरासत' },
            { n: '9th', hi: 'नवम', name: 'Dharma', desc: 'Luck, father, guru, higher learning, dharma', hiDesc: 'भाग्य, पिता, गुरु, उच्च शिक्षा, धर्म' },
            { n: '10th', hi: 'दशम', name: 'Karma', desc: 'Career, public reputation, authority', hiDesc: 'कैरियर, प्रतिष्ठा, अधिकार' },
            { n: '11th', hi: 'एकादश', name: 'Labha', desc: 'Gains, income, friends, elder siblings, wishes', hiDesc: 'लाभ, आय, मित्र, बड़े भाई-बहन, इच्छाएँ' },
            { n: '12th', hi: 'द्वादश', name: 'Vyaya', desc: 'Loss, expenses, foreign travel, moksha', hiDesc: 'हानि, व्यय, विदेश यात्रा, मोक्ष' },
          ].map(h => (
            <div key={h.n} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-2.5">
              <span className="text-gold-light font-bold">{h.n}</span> <span className="text-gold-dark">({h.name})</span>
              <span className="text-text-tertiary ml-1">{isHi ? h.hi : ''}</span>
              <p className="text-text-tertiary mt-0.5">{isHi ? <>{h.hiDesc}</> : <>{h.desc}</>}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>भाव सूचकताएँ BPHS अध्याय 11-12, फलदीपिका अध्याय 2, और सारावली में वर्णित हैं। पराशर ने व्यवस्थित रूप से प्रत्येक भाव के शासन क्षेत्र सूचीबद्ध किए, और बाद के टीकाकारों जैसे वराहमिहिर और मन्त्रेश्वर ने इन सूचियों को परिष्कृत और विस्तारित किया। 12-भाव प्रणाली दो सहस्राब्दियों से उल्लेखनीय रूप से स्थिर रही है।</> : <>The house significations are described in BPHS Chapters 11-12, Phaladeepika Chapter 2, and Saravali. Parashara systematically lists what each house governs, and later commentators like Varahamihira and Mantreshwara refined and expanded these lists. The 12-house system has remained remarkably stable for over two millennia.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: House Classifications ──────────────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'House Classifications', hi: 'भाव वर्गीकरण', sa: 'भाव वर्गीकरण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>भावों को कार्यात्मक श्रेणियों में बाँटा जाता है जो निर्धारित करती हैं कि उनके स्वामी कुण्डली में कैसा व्यवहार करते हैं। यह वर्गीकरण अत्यंत महत्वपूर्ण है — त्रिकोण भाव का स्वामी स्वभावतः शुभ होता है, जबकि दुःस्थान भाव का स्वामी चुनौतियाँ लाता है। ये समूह योगों (ग्रह संयोजन) का आधार बनाते हैं।</> : <>Houses are grouped into functional categories that determine how their lords behave in the chart. This classification is crucial — a planet ruling a Trikona house is inherently auspicious, while a planet ruling a Dusthana house carries challenges. These groupings form the foundation of yogas (planetary combinations).</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">Kendra (Pillars) — 1, 4, 7, 10 / केन्द्र (स्तम्भ)</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>चार कोणीय भाव संरचनात्मक रीढ़ हैं। ये जीवन के चार स्तम्भ दर्शाते हैं: आत्म, गृह, संबंध, कर्म। केन्द्र में ग्रह केन्द्र बल प्राप्त करते हैं। केन्द्र में शुभ ग्रह पूरी कुण्डली को उन्नत करते हैं।</> : <>The four angular houses form the structural backbone. They represent the four pillars of life: self, home, relationships, career. Planets in Kendras gain Kendra Bala (angular strength). Benefics in Kendras uplift the entire chart.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/10">
            <p className="text-emerald-400 font-bold text-sm">Trikona (Fortune) — 1, 5, 9 / त्रिकोण (भाग्य)</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>त्रिकोण भाव लक्ष्मी स्थान हैं — दैवी कृपा के आसन। प्रथम भाव केन्द्र और त्रिकोण दोनों है (इसलिए लग्न स्वामी सदैव शुभ है)। पंचम पूर्व पुण्य (पूर्वजन्म का पुण्य), और नवम भाग्य और धर्म पर शासन करता है। त्रिकोण स्वामी सदैव शुभ कारक ग्रह होते हैं।</> : <>The trine houses are Lakshmi Sthanas — seats of divine grace. The 1st house is both Kendra and Trikona (hence the Lagna lord is always auspicious). The 5th governs Purva Punya (past-life merit), and the 9th governs Bhagya (fortune and dharma). Trikona lords are always benefic functional planets.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">Dusthana (Challenges) — 6, 8, 12 / दुःस्थान (चुनौतियाँ)</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>ये भाव बाधाओं से जुड़े हैं, लेकिन परिवर्तन से भी। षष्ठ प्रयास से शत्रुओं और रोग पर विजय देता है। अष्टम संकट से परिवर्तित करता है और गुप्त ज्ञान प्रदान करता है। द्वादश अहंकार को विलीन करके मोक्ष का मार्ग खोलता है। प्राकृतिक पापग्रह यहाँ वास्तव में अच्छा प्रदर्शन कर सकते हैं।</> : <>These houses deal with obstacles, but also transformation. The 6th gives the ability to overcome enemies and disease through effort. The 8th transforms through crisis and grants hidden knowledge. The 12th dissolves ego and opens the path to moksha. Natural malefics can actually thrive here.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-blue-500/10">
            <p className="text-blue-300 font-bold text-sm">Upachaya (Growth) — 3, 6, 10, 11 / उपचय (वृद्धि)</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>इन भावों में परिणाम आयु और प्रयास के साथ सुधरते हैं। पापग्रह (सूर्य, मंगल, शनि, राहु) यहाँ स्थित होकर उत्पादक बनते हैं — वे अपनी आक्रामक ऊर्जा को साहस (तृतीय), प्रतिस्पर्धा पर विजय (षष्ठ), कर्म महत्वाकांक्षा (दशम), और भौतिक लाभ (एकादश) में प्रवाहित करते हैं।</> : <>Results in these houses improve with age and effort. Malefic planets (Sun, Mars, Saturn, Rahu) placed here become productive — they channel their aggressive energy into courage (3rd), defeating competition (6th), career ambition (10th), and material gains (11th).</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Why Kendra + Trikona = Raja Yoga', hi: 'केन्द्र + त्रिकोण = राजयोग क्यों', sa: 'केन्द्र + त्रिकोण = राजयोग क्यों' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>केन्द्र विष्णु (धारण शक्ति) और त्रिकोण लक्ष्मी (भाग्य, कृपा) का प्रतिनिधित्व करते हैं। जब उनके स्वामी एक साथ आते हैं — युति, परस्पर दृष्टि, या राशि परिवर्तन से — शक्ति और भाग्य का मिलन राजयोग बनाता है, अर्थात &quot;राजसी संयोजन।&quot; यह पाराशरी ज्योतिष का सबसे महत्वपूर्ण योग सिद्धांत है।</> : <>Kendras represent Vishnu (sustaining power) and Trikonas represent Lakshmi (fortune, grace). When their lords come together — by conjunction, mutual aspect, or sign exchange — the union of power and fortune creates Raja Yoga, literally &quot;royal combination.&quot; This is the single most important yoga principle in Parashari Jyotish.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: House Lords ────────────────────────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'House Lords — Who Owns Which House?', hi: 'भाव स्वामी — किस भाव का मालिक कौन?', sa: 'भाव स्वामी — किस भाव का मालिक कौन?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक भाव का &quot;स्वामी&quot; वह ग्रह है जो उसमें स्थित राशि का शासक है। उदाहरण के लिए, यदि मेष पंचम भाव में है, तो मंगल पंचम भाव का स्वामी है। यदि तुला एकादश भाव में है, तो शुक्र एकादश का स्वामी है। भाव स्वामी जहाँ भी जाता है वहाँ भाव की सूचकताएँ ले जाता है — यदि पंचम स्वामी दशम भाव में जाता है, तो संतान/रचनात्मकता (पंचम) कर्म (दशम) से मिलता है, शायद शिक्षा, मनोरंजन, या बच्चों से जुड़े कार्य में कैरियर।</> : <>Every house is &quot;owned&quot; by the planet that rules the sign occupying it. For example, if Aries falls in the 5th house, Mars rules the 5th house. If Libra falls in the 11th house, Venus rules the 11th. The house lord carries the house&apos;s significations wherever it goes — if the 5th lord goes to the 10th house, children/creativity (5th) merges with career (10th), perhaps indicating a career in education, entertainment, or work involving children.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मुख्य सिद्धांत: <strong className="text-gold-light">प्रथम भाव स्वामी दशम में</strong> = आत्म (प्रथम) कर्म और सार्वजनिक जीवन (दशम) की ओर — स्वाभाविक नेता। <strong className="text-gold-light">सप्तम स्वामी द्वादश में</strong> = विवाह (सप्तम) का विदेश (द्वादश) से संबंध — अक्सर विदेशी जीवनसाथी या विवाह के बाद विदेश बसना। <strong className="text-gold-light">नवम स्वामी पंचम में</strong> = पिता का भाग्य (नवम) संतान/शिक्षा (पंचम) की ओर — सौभाग्यशाली पालन-पोषण, सशक्त उच्च शिक्षा।</> : <>Key principle: <strong className="text-gold-light">The lord of the 1st house placed in the 10th house</strong> = the self (1st) directed toward career and public life (10th) — a natural leader. <strong className="text-gold-light">The lord of the 7th in the 12th</strong> = marriage (7th) connecting to foreign lands (12th) — often a foreign spouse or settling abroad after marriage. <strong className="text-gold-light">The lord of the 9th in the 5th</strong> = father&apos;s fortune (9th) flowing to children/education (5th) — privileged upbringing, strong higher education.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 1: [2], 2: [5], 9: [4] }}
          title={tl({ en: 'Aries Lagna — Mars in 1st, Venus in 2nd, Jupiter in 9th', hi: 'मेष लग्न — मंगल प्रथम में, शुक्र द्वितीय में, बृहस्पति नवम में', sa: 'मेष लग्न — मंगल प्रथम में, शुक्र द्वितीय में, बृहस्पति नवम में' }, locale)}
          highlight={[1, 2, 9]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">मेष लग्न:</span> मंगल प्रथम (मेष) और अष्टम (वृश्चिक) दोनों का स्वामी है। शुक्र द्वितीय (वृषभ) और सप्तम (तुला) का स्वामी है। बृहस्पति नवम (धनु) और द्वादश (मीन) का स्वामी है। यहाँ बृहस्पति नवम स्वामी के रूप में सर्वाधिक शुभ ग्रह है — यदि यह लग्न पर दृष्टि डाले या केन्द्र में बैठे, तो पूरी कुण्डली उन्नत होती है।</> : <><span className="text-gold-light font-medium">Aries Lagna:</span> Mars owns both the 1st (Aries) and 8th (Scorpio). Venus owns the 2nd (Taurus) and 7th (Libra). Jupiter owns the 9th (Sagittarius) and 12th (Pisces). Here, Jupiter as 9th lord is the most benefic planet — if it aspects the Lagna or sits in a Kendra, it uplifts the entire chart.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">कर्क लग्न:</span> चन्द्र प्रथम, सूर्य द्वितीय, मंगल पंचम और दशम का स्वामी है (अतः मंगल कर्क लग्न के लिए राजयोगकारक है क्योंकि यह त्रिकोण और केन्द्र दोनों का स्वामी है)। बृहस्पति षष्ठ और नवम का स्वामी है। शनि सप्तम और अष्टम का स्वामी है (मारक ग्रह — संभावित हानि)।</> : <><span className="text-gold-light font-medium">Cancer Lagna:</span> Moon rules the 1st, Sun rules the 2nd, Mars rules the 5th and 10th (hence Mars forms Raja Yoga for Cancer Lagna as it rules both a Trikona and a Kendra). Jupiter rules the 6th and 9th. Saturn rules the 7th and 8th (a Maraka planet — potential harm).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;बृहस्पति सदैव शुभ और शनि सदैव अशुभ है।&quot; यह मूलतः गलत है। कारक स्वभाव स्वामित्व पर निर्भर करता है। वृषभ लग्न के लिए बृहस्पति अष्टम और एकादश का स्वामी है — विशेष शुभ नहीं। शनि नवम और दशम का स्वामी है — कुण्डली का सर्वश्रेष्ठ ग्रह जो योगकारक बनता है। प्राकृतिक शुभ ग्रह दुःस्थान का स्वामी होने पर हानिकारक बनते हैं; प्राकृतिक पापग्रह त्रिकोण का स्वामी होने पर सहायक बनते हैं।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;Jupiter is always good and Saturn is always bad.&quot; This is fundamentally wrong. Functional nature depends on lordship. For Taurus Lagna, Jupiter rules the 8th and 11th — not especially benefic. Saturn rules the 9th and 10th — the best planet in the chart forming Yoga Karaka. Natural benefics owning Dusthanas become harmful; natural malefics owning Trikonas become helpful.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Practical Application — Yoga Karaka by Lagna', hi: 'व्यावहारिक प्रयोग — लग्नानुसार योगकारक', sa: 'व्यावहारिक प्रयोग — लग्नानुसार योगकारक' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>योगकारक वह ग्रह है जो एक साथ केन्द्र और त्रिकोण दोनों का स्वामी हो। प्रत्येक लग्न के लिए योगकारक भिन्न होता है:</> : <>A Yoga Karaka is a planet that rules both a Kendra and a Trikona simultaneously. The Yoga Karaka differs for each Lagna:</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">{isHi ? 'मेष:' : 'Aries:'}</span> {isHi ? 'शनि — 10वें + 11वें (लेकिन 11वाँ त्रिकोण नहीं, अतः शुद्ध योगकारक नहीं)' : 'No pure Yoga Karaka (Saturn rules 10th + 11th, but 11th is not a Trikona)'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">{isHi ? 'वृषभ:' : 'Taurus:'}</span> {isHi ? 'शनि — 9वें (त्रिकोण) + 10वें (केन्द्र) = पूर्ण योगकारक' : 'Saturn — 9th (Trikona) + 10th (Kendra) = perfect Yoga Karaka'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">{isHi ? 'कर्क:' : 'Cancer:'}</span> {isHi ? 'मंगल — 5वें (त्रिकोण) + 10वें (केन्द्र) = पूर्ण योगकारक' : 'Mars — 5th (Trikona) + 10th (Kendra) = perfect Yoga Karaka'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">{isHi ? 'सिंह:' : 'Leo:'}</span> {isHi ? 'मंगल — 4वें (केन्द्र) + 9वें (त्रिकोण) = पूर्ण योगकारक' : 'Mars — 4th (Kendra) + 9th (Trikona) = perfect Yoga Karaka'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">{isHi ? 'तुला:' : 'Libra:'}</span> {isHi ? 'शनि — 4वें (केन्द्र) + 5वें (त्रिकोण) = पूर्ण योगकारक' : 'Saturn — 4th (Kendra) + 5th (Trikona) = perfect Yoga Karaka'}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'कुम्भ:' : 'Aquarius:'}</span> {isHi ? 'शुक्र — 4वें (केन्द्र) + 9वें (त्रिकोण) = पूर्ण योगकारक' : 'Venus — 4th (Kendra) + 9th (Trikona) = perfect Yoga Karaka'}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन भाव स्वामियों की गणना, योगों की पहचान, और जीवन-क्षेत्र भविष्यवाणियाँ स्वचालित रूप से करता है। मॉड्यूल 9.1 में कुण्डली की मूल संरचना और 9.3 में ग्रह गरिमा (उच्च/नीच) विस्तार से समझाये गये हैं।</> : <>Our Kundali engine automatically calculates house lords, identifies yogas, and provides life-area predictions. See Module 9.1 for the basic Kundali structure and Module 9.3 for planetary dignities (exaltation/debilitation) that determine how effectively each lord can deliver its results.</>}</p>
      </section>
    </div>
  );
}

export default function Module9_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


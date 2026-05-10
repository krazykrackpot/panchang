'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/19-3.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_19_3', phase: 6, topic: 'Jaimini', moduleNumber: '19.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
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
          'Argala means "bolt"  –  planets in the 2nd, 4th, and 11th from a house "bolt" it with support, influencing its results.',
          'Counter-argala from the 3rd, 10th, and 12th can obstruct the support  –  but only if the obstructing planets are strong enough.',
          'Argala overrides aspects in Jaimini  –  a house with strong Argala will manifest its results regardless of aspect patterns.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Is Argala?', hi: 'अर्गला क्या है?', sa: 'अर्गला क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अर्गला जैमिनी के सर्वाधिक व्यावहारिक उपकरणों में से एक है  –  यह निर्धारित करने की पद्धति कि कौन-से भाव ग्रहीय हस्तक्षेप द्वारा &quot;समर्थित&quot; या &quot;बन्द&quot; हैं, और कौन-से असुरक्षित छोड़े गये हैं। &quot;अर्गला&quot; शब्द का शाब्दिक अर्थ चिटकनी या सिटकनी है, जैसे दरवाज़े की चिटकनी जो प्रवेश को सुरक्षित करती है। ज्योतिषीय दृष्टि से, जब ग्रह किसी भाव के सापेक्ष निश्चित स्थितियों में हों, वे उस भाव को अपने प्रभाव से &quot;बन्द&quot; कर देते हैं।</>
            : <>Argala is one of Jaimini&apos;s most practical tools  –  a system for determining which houses are &quot;supported&quot; or &quot;bolted&quot; by planetary intervention, and which are left exposed. The word &quot;argala&quot; literally means a bolt or bar, like a door-bolt that secures an entrance. When planets occupy certain positions relative to a house, they &quot;bolt&quot; that house with their influence, ensuring that the house&apos;s significations manifest in the native&apos;s life.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>तीन प्राथमिक अर्गला स्थितियाँ हैं: सन्दर्भ से <strong>दूसरा भाव</strong>  –  धन (धन/संसाधन) अर्गला; <strong>चौथा भाव</strong>  –  सुख (आनन्द/सम्पत्ति) अर्गला; <strong>ग्यारहवाँ भाव</strong>  –  लाभ (प्राप्ति/पूर्णता) अर्गला। इसके अतिरिक्त, <strong>पाँचवाँ भाव</strong> विशेष पुत्र अर्गला बनाता है।</>
            : <>The three primary Argala positions are: <strong>2nd house</strong> from the reference  –  Dhana (wealth/resource) Argala; <strong>4th house</strong>  –  Sukha (happiness/property) Argala; <strong>11th house</strong>  –  Labha (gains/fulfillment) Argala. Additionally, the <strong>5th house</strong> creates a special Putra Argala related to children, creativity, and past-life merit.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Virodha Argala  –  The Counter-Bolt', hi: 'विरोध अर्गला  –  प्रतिचिटकनी', sa: 'विरोध अर्गला  –  प्रतिचिटकनी' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>प्रत्येक अर्गला स्थिति के लिए एक संगत विरोध अर्गला (बाधा) स्थिति है। <strong>तीसरे</strong> भाव के ग्रह दूसरे भाव की अर्गला का प्रतिकार करते हैं। <strong>दसवें</strong> के ग्रह चौथे की अर्गला का। <strong>बारहवें</strong> के ग्रह ग्यारहवें की अर्गला का। <strong>नौवें</strong> के ग्रह पाँचवें की पुत्र अर्गला का। यदि विरोध अर्गला ग्रह संख्या या शक्ति में अर्गला ग्रहों के बराबर या अधिक हों, हस्तक्षेप निष्प्रभावित हो जाता है  –  चिटकनी &quot;खुल&quot; जाती है।</>
            : <>For every Argala position, there is a corresponding Virodha Argala (obstruction) position. Planets in the <strong>3rd</strong> counter the 2nd house Argala. Planets in the <strong>10th</strong> counter the 4th. Planets in the <strong>12th</strong> counter the 11th. Planets in the <strong>9th</strong> counter the 5th (Putra Argala). If the Virodha Argala planets are equal in number or stronger than the Argala planets, the intervention is neutralized  –  the bolt is &quot;unlocked.&quot;</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Argala vs Parashari Aspects', hi: 'अर्गला बनाम पाराशरी दृष्टि', sa: 'अर्गला विरुद्धं पाराशरी दृष्टिः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>पाराशरी दृष्टि (aspect) और जैमिनी अर्गला भिन्न अवधारणाएँ हैं। दृष्टि &quot;दृश्यता&quot; है  –  ग्रह एक भाव को देखता है और प्रभावित करता है। अर्गला &quot;हस्तक्षेप&quot; है  –  ग्रह भाव के परिणामों को सक्रिय रूप से समर्थन या अवरोध करता है। जैमिनी सूत्र में, अर्गला दृष्टि को ओवरराइड करती है: यदि किसी भाव पर मजबूत अबाधित अर्गला है, तो उसके फलादेश प्रकट होंगे चाहे दृष्टि प्रतिकूल हो। यह वह बिन्दु है जहाँ जैमिनी पाराशरी से विचलित होता है।</>
            : <>Parashari aspects and Jaimini Argala are different concepts. An aspect is &quot;visibility&quot;  –  a planet sees and influences a house. Argala is &quot;intervention&quot;  –  a planet actively supports or blocks a house&apos;s outcomes. In Jaimini&apos;s sutras, Argala overrides aspects: if a house has strong unobstructed Argala, its significations WILL manifest even if aspects are unfavourable. This is where Jaimini diverges from Parashara.</>}
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
          {tl({ en: 'Types of Argala in Detail', hi: 'अर्गला के प्रकार विस्तार से', sa: 'अर्गला के प्रकार विस्तार से' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>धन अर्गला (दूसरा भाव):</strong> धन, पारिवारिक संसाधन और वाणी। जब शुभ ग्रह किसी भाव से दूसरे में हों, वे सुनिश्चित करते हैं कि भाव को आर्थिक पोषण मिले। सातवें भाव से दूसरे में बृहस्पति विवाह क्षेत्र को समृद्धि से बन्द करता है। अशुभ ग्रह भी अर्गला बनाते हैं  –  किन्तु संघर्ष या बाध्य संचय द्वारा।</>
            : <><strong>Dhana Argala (2nd house):</strong> Wealth, family resources, and speech. When benefic planets occupy the 2nd from a house, they ensure financial nourishment. Jupiter in the 2nd from the 7th bolts marriage with prosperity. Malefics also create Argala  –  but wealth may come through struggle or forced accumulation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>सुख अर्गला (चौथा भाव):</strong> भावनात्मक सुख, सम्पत्ति, वाहन और माता का प्रभाव। <strong>लाभ अर्गला (ग्यारहवाँ भाव):</strong> प्राप्ति, पूर्णता और सामाजिक जाल  –  यहाँ के ग्रह सुनिश्चित करते हैं कि भाव के वादे फलित हों।</>
            : <><strong>Sukha Argala (4th house):</strong> Emotional happiness, property, vehicles, and mother&apos;s influence. Venus in the 4th from lagna bolts the self with luxury. <strong>Labha Argala (11th house):</strong> Gains, fulfillment, and social networks  –  planets here ensure the house&apos;s promises bear fruit.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Putra Argala  –  The Special 5th', hi: 'पुत्र अर्गला  –  विशेष पाँचवाँ', sa: 'पुत्र अर्गला  –  विशेष पाँचवाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>किसी भी सन्दर्भ से पाँचवाँ भाव पुत्र अर्गला बनाता है  –  सृजनशीलता, सन्तान, बुद्धि और पूर्वजन्म के पुण्य में निहित हस्तक्षेप। यह विशेष है क्योंकि पाँचवाँ भाव संचित आध्यात्मिक पुण्य का प्रतिनिधित्व करता है। शक्तिशाली शुभ ग्रह होने पर भाव को &quot;दैवी सहायता&quot; मिलती है। विरोध अर्गला नौवें भाव से आती है (जो पाँचवें से पाँचवाँ है  –  एक रोचक पुनरावृत्त प्रतिमान)।</>
            : <>The 5th house from any reference creates Putra Argala  –  intervention rooted in creativity, children, intelligence, and past-life merit. This is special because the 5th represents accumulated spiritual credit. Strong benefics give &quot;divine support&quot;  –  blessings from past actions that manifest as unexplained luck. The Virodha comes from the 9th house (5th from the 5th  –  an interesting recursive pattern).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अर्गला केवल शुभ ग्रहों से कार्य करती है।&quot; शुभ और अशुभ दोनों ग्रह अर्गला बनाते हैं। शनि भी धन अर्गला बनाता है  –  किन्तु धन कठिन परिश्रम या विलम्बित सन्तुष्टि द्वारा आ सकता है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Argala only works with benefic planets.&quot; Both benefic and malefic planets create Argala. Saturn in the 2nd still creates Dhana Argala  –  but wealth may come through hard work or delayed gratification.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;विरोध अर्गला सदैव अर्गला को रद्द करती है।&quot; विरोध अर्गला तभी प्रभावी होती है जब बाधक ग्रह अर्गला ग्रहों के बराबर या अधिक शक्तिशाली हों। एक शुभ ग्रह की अर्गला को एक अशुभ ग्रह के विरोध से रद्द किया जा सकता है, किन्तु दो शुभ ग्रहों की अर्गला को एक अकेले अशुभ ग्रह शायद रद्द न कर सके।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Virodha Argala always cancels Argala.&quot; Virodha is only effective when the obstructing planets are equal or stronger than the Argala planets. One malefic may counter one benefic&apos;s Argala, but one malefic probably cannot counter two benefics&apos; Argala.</>}
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
          {tl({ en: 'Practical Interpretation Examples', hi: 'व्यावहारिक व्याख्या उदाहरण', sa: 'व्यावहारिक व्याख्या उदाहरण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>व्यावहारिक विधि: प्रत्येक भाव के लिए देखें कि उससे दूसरे, चौथे, पाँचवें और ग्यारहवें में ग्रह हैं या नहीं। यदि हैं, तो उस भाव पर अर्गला है। फिर संगत विरोध स्थितियों (तीसरे, दसवें, नौवें, बारहवें) की जाँच करें। अनेक अबाधित अर्गलाओं वाले भाव कुण्डली में सर्वाधिक शक्तिशाली हैं।</>
            : <>Practical method: for each house, check if planets exist in the 2nd, 4th, 5th, and 11th from it. If they do, that house has Argala. Then check corresponding Virodha positions (3rd, 10th, 9th, 12th). Houses with multiple unobstructed Argalas are the strongest in the chart  –  areas where the native experiences the most tangible results.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example  –  Analysing the 7th House', hi: 'कार्यान्वित उदाहरण  –  सातवें भाव का विश्लेषण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Analyzing the 7th house (marriage):</span> Jupiter is in the 8th house (2nd from 7th = Dhana Argala). Venus is in the 10th house (4th from 7th = Sukha Argala). Moon is in the 5th house (11th from 7th = Labha Argala). Three Argalas!
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Checking Virodha:</span> 9th house (3rd from 7th) = empty  –  no counter to Jupiter&apos;s Argala. 4th house (10th from 7th) = Saturn  –  creates Virodha for Venus&apos;s Sukha Argala. One benefic vs one malefic: Sukha Argala may partially hold. 6th house (12th from 7th) = empty  –  no counter to Moon&apos;s Argala.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Result:</span> The 7th house has strong, mostly unobstructed Argala. Marriage brings wealth (Jupiter), some emotional comfort despite challenges (Venus vs Saturn), and fulfillment through social connections (Moon). This native&apos;s married life is well-supported.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Application  –  Argala Maps', hi: 'आधुनिक अनुप्रयोग  –  अर्गला मानचित्र', sa: 'आधुनिकी प्रासङ्गिकता  –  अर्गला मानचित्र' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>अर्गला विश्लेषण शीघ्रता से मूल्यांकन करने का मार्ग प्रदान करता है कि कौन-से जीवन क्षेत्र &quot;सुवित्तपोषित&quot; हैं। आधुनिक अभ्यास में ज्योतिषी परामर्श के दौरान प्राथमिकता निर्धारण के लिए अर्गला का प्रयोग करते हैं  –  शक्तिशाली अबाधित अर्गला वाले भाव वे क्षेत्र हैं जहाँ जातक को ऊर्जा लगानी चाहिए, जबकि अर्गला-रहित भावों को उपचारात्मक उपायों की आवश्यकता हो सकती है। सॉफ्टवेयर सभी 12 भावों का तत्काल अर्गला मानचित्र बना सकता है। हमारे ऐप का कुण्डली विश्लेषण इस डेटा को जैमिनी टैब में प्रदर्शित करता है।</>
            : <>Argala analysis provides a quick way to assess which life areas are &quot;well-funded&quot; by planetary support. In modern practice, astrologers use Argala to prioritize during consultation  –  houses with strong unobstructed Argala are areas to invest energy in, while houses lacking Argala may need remedial measures. Software can instantly generate an &quot;Argala map&quot; across all 12 houses. Our app&apos;s Kundali analysis displays this data in the Jaimini tab.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module19_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

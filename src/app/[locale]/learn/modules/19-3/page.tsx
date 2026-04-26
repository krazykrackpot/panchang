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
  estimatedMinutes: 13,
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
          'Argala means "bolt" — planets in the 2nd, 4th, and 11th from a house "bolt" it with support, influencing its results.',
          'Counter-argala from the 3rd, 10th, and 12th can obstruct the support — but only if the obstructing planets are strong enough.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Is Argala?', hi: 'अर्गला क्या है?', sa: 'अर्गला क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अर्गला जैमिनी के सर्वाधिक व्यावहारिक उपकरणों में से एक है — यह निर्धारित करने की पद्धति कि कौन-से भाव ग्रहीय हस्तक्षेप द्वारा &quot;समर्थित&quot; या &quot;बन्द&quot; हैं, और कौन-से असुरक्षित छोड़े गये हैं। &quot;अर्गला&quot; शब्द का शाब्दिक अर्थ चिटकनी या सिटकनी है, जैसे दरवाज़े की चिटकनी जो प्रवेश को सुरक्षित करती है। ज्योतिषीय दृष्टि से, जब ग्रह किसी भाव के सापेक्ष निश्चित स्थितियों में हों, वे उस भाव को अपने प्रभाव से &quot;बन्द&quot; कर देते हैं, यह सुनिश्चित करते हुए कि भाव के फलादेश जातक के जीवन में प्रकट हों।</>
            : <>Argala is one of Jaimini&apos;s most practical tools — a system for determining which houses are &quot;supported&quot; or &quot;bolted&quot; by planetary intervention, and which are left exposed. The word &quot;argala&quot; literally means a bolt or bar, like a door-bolt that secures an entrance. In astrological terms, when planets occupy certain positions relative to a house, they &quot;bolt&quot; that house with their influence, ensuring that the house&apos;s significations manifest in the native&apos;s life.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>तीन प्राथमिक अर्गला स्थितियाँ हैं: सन्दर्भ से <strong>दूसरा भाव</strong> — धन (धन/संसाधन) अर्गला; <strong>चौथा भाव</strong> — सुख (आनन्द/सम्पत्ति) अर्गला; <strong>ग्यारहवाँ भाव</strong> — लाभ (प्राप्ति/पूर्णता) अर्गला। इसके अतिरिक्त, <strong>पाँचवाँ भाव</strong> विशेष पुत्र अर्गला बनाता है जो सन्तान, सृजनशीलता और पूर्वजन्म के पुण्य से सम्बन्धित है।</>
            : <>The three primary Argala positions are: <strong>2nd house</strong> from the reference — Dhana (wealth/resource) Argala; <strong>4th house</strong> — Sukha (happiness/property) Argala; <strong>11th house</strong> — Labha (gains/fulfillment) Argala. Additionally, the <strong>5th house</strong> creates a special Putra Argala related to children, creativity, and past-life merit.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Virodha Argala — The Counter-Bolt', hi: 'विरोध अर्गला — प्रतिचिटकनी', sa: 'विरोध अर्गला — प्रतिचिटकनी' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>प्रत्येक अर्गला स्थिति के लिए एक संगत विरोध अर्गला (बाधा) स्थिति है। <strong>तीसरे</strong> भाव के ग्रह दूसरे भाव की अर्गला का प्रतिकार करते हैं। <strong>दसवें</strong> के ग्रह चौथे की अर्गला का। <strong>बारहवें</strong> के ग्रह ग्यारहवें की अर्गला का। यदि विरोध अर्गला ग्रह संख्या या शक्ति में अर्गला ग्रहों के बराबर या अधिक हों, हस्तक्षेप निष्प्रभावित हो जाता है — चिटकनी &quot;खुल&quot; जाती है।</>
            : <>For every Argala position, there is a corresponding Virodha Argala (obstruction) position. Planets in the <strong>3rd</strong> house counter the 2nd house Argala. Planets in the <strong>10th</strong> house counter the 4th house Argala. Planets in the <strong>12th</strong> house counter the 11th house Argala. If the Virodha Argala planets are equal in number or stronger than the Argala planets, the intervention is neutralized — the bolt is &quot;unlocked.&quot;</>}
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
            ? <><strong>धन अर्गला (दूसरा भाव):</strong> धन, पारिवारिक संसाधन और वाणी। जब शुभ ग्रह किसी भाव से दूसरे में हों, वे सुनिश्चित करते हैं कि भाव को आर्थिक पोषण मिले। सातवें भाव से दूसरे में बृहस्पति, उदाहरणार्थ, विवाह क्षेत्र को समृद्धि से बन्द करता है — पत्नी/पति धन ला सकता है, या विवाह जातक की आर्थिक स्थिति सुधार सकता है।</>
            : <><strong>Dhana Argala (2nd house):</strong> Wealth, family resources, and speech. When benefic planets occupy the 2nd from a house, they ensure that the house receives financial nourishment. Jupiter in the 2nd from the 7th house, for example, bolts the marriage sector with prosperity — the spouse may bring wealth, or the marriage may improve the native&apos;s financial status. If malefics are in the 2nd, the Argala still exists but operates through struggle or forced accumulation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>सुख अर्गला (चौथा भाव):</strong> भावनात्मक सुख, सम्पत्ति, वाहन और माता का प्रभाव। किसी भाव से चौथे के ग्रह उस भाव के मामलों को सुख और भावनात्मक आधार प्रदान करते हैं। <strong>लाभ अर्गला (ग्यारहवाँ भाव):</strong> प्राप्ति, पूर्णता और सामाजिक जाल। यह उपलब्धि की अर्गला है — यहाँ के ग्रह सुनिश्चित करते हैं कि भाव के वादे वास्तव में फलित हों और जातक को उनसे लाभ मिले।</>
            : <><strong>Sukha Argala (4th house):</strong> Emotional happiness, property, vehicles, and mother&apos;s influence. Planets in the 4th from a house provide comfort and emotional grounding to that house&apos;s affairs. Venus in the 4th from the lagna bolts the self with luxury and aesthetic pleasure. <strong>Labha Argala (11th house):</strong> Gains, fulfillment, and social networks. This is the Argala of achievement — planets here ensure that the house&apos;s promises actually bear fruit and the native gains from them.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Putra Argala — The Special 5th', hi: 'पुत्र अर्गला — विशेष पाँचवाँ', sa: 'पुत्र अर्गला — विशेष पाँचवाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">विशेष प्रकरण:</span> किसी भी सन्दर्भ से पाँचवाँ भाव पुत्र अर्गला बनाता है — सृजनशीलता, सन्तान, बुद्धि और पूर्वजन्म के पुण्य (पूर्व पुण्य) में निहित हस्तक्षेप। यह अर्गला विशेष मानी जाती है क्योंकि पाँचवाँ भाव संचित आध्यात्मिक पुण्य का प्रतिनिधित्व करता है। जब किसी भाव से पाँचवें में शक्तिशाली शुभ ग्रह हों, भाव को &quot;दैवी सहायता&quot; मिलती है — पूर्व कर्मों के आशीर्वाद जो अकथनीय भाग्य या सुगम परिणामों के रूप में प्रकट होते हैं।</>
            : <><span className="text-gold-light font-medium">Special case:</span> The 5th house from any reference creates Putra Argala — an intervention rooted in creativity, children, intelligence, and past-life merit (Poorva Punya). This Argala is considered special because the 5th house represents accumulated spiritual credit. When the 5th from a house has strong benefics, the house receives &quot;divine support&quot; — blessings from past actions that manifest as unexplained luck or smooth outcomes. The Virodha for Putra Argala comes from the 9th house (which is the 5th from the 5th, creating an interesting recursive pattern).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अर्गला केवल शुभ ग्रहों से कार्य करती है।&quot; यह असत्य है। शुभ और अशुभ दोनों ग्रह अर्गला बनाते हैं। सातवें से दूसरे में शनि भी विवाह पर धन अर्गला बनाता है — किन्तु धन कठिन परिश्रम, विलम्बित सन्तुष्टि या वरिष्ठ साथियों द्वारा आ सकता है। अर्गला विद्यमान है; उसकी गुणवत्ता ग्रह के स्वभाव से रंगित होती है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Argala only works with benefic planets.&quot; This is false. Both benefic and malefic planets create Argala. Saturn in the 2nd from the 7th still creates Dhana Argala on marriage — but the wealth may come through hard work, delayed gratification, or older partners. The Argala is present; its quality is colored by the planet&apos;s nature.</>}
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
          {tl({ en: 'Using Argala in Prediction', hi: 'भविष्यवाणी में अर्गला का प्रयोग', sa: 'भविष्यवाणी में अर्गला का प्रयोग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>व्यावहारिक विधि सरल है: प्रत्येक भाव जिसका आप विश्लेषण करना चाहते हैं, देखें कि उससे दूसरे, चौथे, पाँचवें और ग्यारहवें में ग्रह हैं या नहीं। यदि हैं, तो उस भाव पर अर्गला है — वह &quot;समर्थित&quot; है और उसके फलादेश शक्तिशाली रूप से प्रकट होने की अधिक सम्भावना है। फिर देखें कि संगत विरोध स्थितियों (तीसरे, दसवें, नौवें और बारहवें) में ग्रह हैं या नहीं। यदि विरोध कमज़ोर है, तो अर्गला बनी रहती है। अनेक अबाधित अर्गलाओं वाले भाव कुण्डली में सर्वाधिक शक्तिशाली हैं — ये जीवन के वे क्षेत्र हैं जहाँ जातक को सर्वाधिक ठोस परिणाम मिलेंगे।</>
            : <>The practical method is straightforward: for each house you want to analyze, check if planets exist in the 2nd, 4th, 5th, and 11th from it. If they do, that house has Argala — it is &quot;supported&quot; and its significations are more likely to manifest strongly. Then check if planets exist in the corresponding Virodha positions (3rd, 10th, 9th, and 12th). If the Virodha is weaker, the Argala holds. Houses with multiple unobstructed Argalas are the strongest in the chart — they are the areas of life where the native will experience the most tangible results.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Analyzing the 7th house (marriage):</span> Jupiter is in the 8th house (2nd from 7th = Dhana Argala). Venus is in the 10th house (4th from 7th = Sukha Argala). Moon is in the 5th house (11th from 7th = Labha Argala). The 7th house has three Argalas!
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Checking Virodha:</span> 9th house (3rd from 7th) = empty. No Virodha for Jupiter&apos;s Argala. 4th house (10th from 7th) = Saturn. Saturn creates Virodha for Venus&apos;s Sukha Argala. Since Venus (benefic, alone) vs Saturn (malefic, alone) — one planet each, but Venus as benefic may be considered stronger. The Sukha Argala may partially hold. 6th house (12th from 7th) = empty. No Virodha for Moon&apos;s Argala.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Result:</span> The 7th house has strong, mostly unobstructed Argala. Marriage will bring wealth (Jupiter), some emotional comfort despite challenges (Venus vs Saturn), and fulfillment through social connections (Moon). This native&apos;s married life is a well-supported area of their chart.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>अर्गला विश्लेषण शीघ्रता से मूल्यांकन करने का मार्ग प्रदान करता है कि कौन-से जीवन क्षेत्र ग्रहीय सहायता से &quot;सुवित्तपोषित&quot; हैं। आधुनिक अभ्यास में ज्योतिषी परामर्श के दौरान प्राथमिकता निर्धारण के लिए अर्गला का प्रयोग करते हैं — शक्तिशाली अबाधित अर्गला वाले भाव वे क्षेत्र हैं जहाँ जातक को ऊर्जा लगानी चाहिए, जबकि अर्गला-रहित या विरोध द्वारा अवरुद्ध भावों को उपचारात्मक उपायों की आवश्यकता हो सकती है। सॉफ्टवेयर सभी 12 भावों की समस्त अर्गला और विरोध सम्बन्धों की तत्काल गणना कर सकता है।</>
            : <>Argala analysis provides a quick way to assess which life areas are &quot;well-funded&quot; by planetary support. In modern practice, astrologers use Argala to prioritize during consultation — houses with strong unobstructed Argala are areas where the native should invest energy, while houses lacking Argala or blocked by Virodha may need remedial measures. Software can instantly calculate all Argala and Virodha relationships across all 12 houses, generating an &quot;Argala map&quot; that reveals the chart&apos;s strongest and weakest sectors at a glance.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module19_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
